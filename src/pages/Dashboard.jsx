import { useState } from "react";
import { LineChart, BarChart, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";

function ProductDashboard() {
  
  const transformarDatos = (jsonData) => {
    const productos = ['A', 'B', 'C'];
    const registros = [];

    jsonData.forEach((fila) => {
      productos.forEach((producto) => {
        registros.push({
          producto,
          mes: fila.mes,
          meta: Number(fila[`Meta ${producto}`]) || 0,
          ventas: Number(fila[`Real ${producto}`]) || 0,
        });
      });
    });

    return registros;
  };

  const getColor = (index) => {
    const palette = [colors.primary, colors.secondary, colors.tertiary];
    return palette[index % palette.length];
  };

  const colors = {
    primary: "#00a89c",    // Verde-azulado
    secondary: "#9654e5",  // Púrpura
    tertiary: "#ff8800",   // Naranja
    
    primaryLight: "#4fbdb5",
    primaryDark: "#007a71",
    secondaryLight: "#b78aed",
    secondaryDark: "#6e3eba",
    tertiaryLight: "#ffaa4d",
    tertiaryDark: "#cc6a00",
  };

  const [data, setData] = useState([]);
  const [resumenProductos, setResumenProductos] = useState([]);
  
  const calcularResumenProductos = (datos) => {
    const agrupado = {};

    datos.forEach((item) => {
      if (!agrupado[item.producto]) {
        agrupado[item.producto] = [];
      }
      agrupado[item.producto].push(item);
    });

    return Object.entries(agrupado).map(([producto, registros], index) => {
      const metaTotal = registros.reduce((acc, r) => acc + r.meta, 0);
      const ventasTotal = registros.reduce((acc, r) => acc + r.ventas, 0);
      const desviacion = metaTotal > 0 ? +((ventasTotal - metaTotal) / metaTotal * 100).toFixed(2) : 0;
      const mesesPositivos = registros.filter((r) => r.ventas >= r.meta).length;
      const totalMeses = registros.length;

      return {
        producto: `Producto ${producto}`, 
        metaTotal: +metaTotal.toFixed(2),
        ventasTotal: +ventasTotal.toFixed(2),
        desviacion,
        mesesPositivos,
        totalMeses,
        color: getColor(index),
      };
    });
  };
  
  // Calculate deviations from the data
  const dataDesviacion = data.map(item => {
    const calcDeviation = (real, meta) => {
      return meta > 0 ? ((real - meta) / meta * 100) : 0;
    };

    return {
      mes: item.mes,
      "Producto A": calcDeviation(Number(item["Real A"]) || 0, Number(item["Meta A"]) || 0),
      "Producto B": calcDeviation(Number(item["Real B"]) || 0, Number(item["Meta B"]) || 0),
      "Producto C": calcDeviation(Number(item["Real C"]) || 0, Number(item["Meta C"]) || 0)
    };
  });

  const [selectedProducts, setSelectedProducts] = useState({
    "Producto A": true,
    "Producto B": true,
    "Producto C": true
  });

  const [metaSums, setMetaSums] = useState({});

  const calculateMetaSums = (data, metaKeys) => {
    const sums = {};

    metaKeys.forEach((key) => {
      sums[key] = data.reduce((acc, row) => {
        const value = Number(row[key]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
    });

    return sums;
  };

  // Manejar cambios en la selección de productos
  const handleProductToggle = (product) => {
    setSelectedProducts({
      ...selectedProducts,
      [product]: !selectedProducts[product]
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate required columns
        if (jsonData.length > 0) {
          const requiredColumns = ['mes', 'Meta A', 'Real A', 'Meta B', 'Real B', 'Meta C', 'Real C'];
          const firstRow = jsonData[0];
          const missingColumns = requiredColumns.filter(col => !(col in firstRow));
          
          if (missingColumns.length > 0) {
            alert(`Faltan las siguientes columnas en el archivo Excel: ${missingColumns.join(', ')}`);
            return;
          }
        }
        
        setData(jsonData);
        const registrosTransformados = transformarDatos(jsonData);
        const resumen = calcularResumenProductos(registrosTransformados);
        setResumenProductos(resumen);
        const sums = calculateMetaSums(jsonData, ['Meta A', 'Meta B', 'Meta C']);
        setMetaSums(sums);
        console.log(metaSums)
        console.log('Data structure:', data);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error al procesar el archivo. Asegúrate de que sea un archivo Excel válido con la estructura correcta.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Filter resumenProductos based on selected products
  const filteredResumenProductos = resumenProductos.filter(p => 
    selectedProducts[p.producto]
  );

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      backgroundColor: '#f9fafb', 
      padding: '24px', 
      borderRadius: '8px' 
    }}>
      {/* Encabezado del Dashboard */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '8px' 
        }}>
          Dashboard de Rendimiento de Productos
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#4b5563' 
        }}>
          Análisis comparativo de metas y ventas reales
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151' 
        }}>
          Cargar archivo Excel:
        </label>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload}
          style={{
            display: 'block',
            width: '100%',
            fontSize: '14px',
            color: '#111827',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: 'white',
            padding: '8px 12px'
          }}
        />
      </div>

      {/* Filtros de Productos */}
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <span style={{ 
          fontWeight: '600', 
          color: '#374151', 
          alignSelf: 'center' 
        }}>
          Filtrar productos:
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => handleProductToggle("Producto A")}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedProducts["Producto A"] ? colors.primary : "#9CA3AF"
            }}
          >
            Producto A
          </button>
          <button 
            onClick={() => handleProductToggle("Producto B")}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedProducts["Producto B"] ? colors.secondary : "#9CA3AF"
            }}
          >
            Producto B
          </button>
          <button 
            onClick={() => handleProductToggle("Producto C")}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedProducts["Producto C"] ? colors.tertiary : "#9CA3AF"
            }}
          >
            Producto C
          </button>
        </div>
      </div>

      {/* Grid de visualizaciones */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '32px' 
      }}>
        {/* Gráfico 1: Metas vs Ventas Reales */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '4px' 
          }}>
            Tendencia de Ventas: Meta vs Real
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '16px' 
          }}>
            Comparativa mensual de objetivos y resultados
          </p>
          <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12 }} 
                  height={60}
                />
                <YAxis 
                  label={{ 
                    value: 'USD (K)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fontSize: 12 } 
                  }} 
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value}K USD`, name]} 
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                
                {/* Product A Lines */}
                <Line 
                  type="monotone" 
                  dataKey="Meta A" 
                  name="Meta A" 
                  stroke={colors.primaryDark} 
                  strokeWidth={2}
                  strokeDasharray="5 5" 
                  dot={{ r: 3, fill: colors.primaryDark }} 
                  activeDot={{ r: 5, fill: colors.primaryDark }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Real A" 
                  name="Real A" 
                  stroke={colors.primary} 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: colors.primary }} 
                  activeDot={{ r: 5, fill: colors.primary }}
                />
                
                {/* Product B Lines */}
                <Line 
                  type="monotone" 
                  dataKey="Meta B" 
                  name="Meta B" 
                  stroke={colors.secondaryDark} 
                  strokeWidth={2}
                  strokeDasharray="5 5" 
                  dot={{ r: 3, fill: colors.secondaryDark }} 
                  activeDot={{ r: 5, fill: colors.secondaryDark }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Real B" 
                  name="Real B" 
                  stroke={colors.secondary} 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: colors.secondary }} 
                  activeDot={{ r: 5, fill: colors.secondary }}
                />
                
                {/* Product C Lines */}
                <Line 
                  type="monotone" 
                  dataKey="Meta C" 
                  name="Meta C" 
                  stroke={colors.tertiaryDark} 
                  strokeWidth={2}
                  strokeDasharray="5 5" 
                  dot={{ r: 3, fill: colors.tertiaryDark }} 
                  activeDot={{ r: 5, fill: colors.tertiaryDark }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Real C" 
                  name="Real C" 
                  stroke={colors.tertiary} 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: colors.tertiary }} 
                  activeDot={{ r: 5, fill: colors.tertiary }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> 

        {/* Gráfico 2: Desviación porcentual */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '4px' 
          }}>
            Desviación Porcentual vs Meta
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '16px' 
          }}>
            Rendimiento mensual por encima/debajo del objetivo
          </p>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%" >
              <ComposedChart data={dataDesviacion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis 
                  label={{ value: '%', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
                  domain={[-8, 8]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => { 
                  if (typeof value === 'number') {
                    return value.toFixed(2) + '%';  
                  }   
                  return value;
                }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                
                {selectedProducts["Producto A"] && (
                  <Bar 
                    dataKey="Producto A" 
                    name="Producto A" 
                    fill={colors.primary}
                    barSize={20}
                  />
                )}
                
                {selectedProducts["Producto B"] && (
                  <Bar 
                    dataKey="Producto B" 
                    name="Producto B" 
                    fill={colors.secondary}
                    barSize={20} 
                  />
                )}
                
                {selectedProducts["Producto C"] && (
                  <Bar 
                    dataKey="Producto C" 
                    name="Producto C" 
                    fill={colors.tertiary}
                    barSize={20} 
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Resumen Anual por Producto - FIXED */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '4px' 
          }}>
            Desempeño Anual por Producto
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '16px' 
          }}>
            Comparativa de metas anuales vs ventas acumuladas
          </p>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredResumenProductos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="producto" tick={{ fontSize: 12 }} />
                <YAxis 
                  label={{ value: 'USD (K)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "metaTotal") return [`${value}K USD`, "Meta Anual"];
                    if (name === "ventasTotal") return [`${value}K USD`, "Ventas Anuales"];
                    if (name === "desviacion") return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, "Desviación"];
                    return [value, name];
                  }}
                />  
                <Legend 
                  payload={[
                    { value: 'Meta Anual', type: 'rect', color: '#8884d8' },
                    { value: 'Ventas Anuales', type: 'rect', color: '#82ca9d' }
                  ]}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="metaTotal" name="metaTotal" fill="#8884d8" barSize={40} />
                <Bar dataKey="ventasTotal" name="ventasTotal" fill="#82ca9d" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPIs y Métricas Clave - FIXED */}
      <div style={{ 
        marginTop: '32px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px' 
      }}>
        {filteredResumenProductos.map((prod) => (
          <div 
            key={prod.producto} 
            style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: `4px solid ${prod.color}`
            }}
          >
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#1f2937' 
            }}>
              {prod.producto}
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px 0', 
              marginTop: '12px' 
            }}>
              <div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280' 
                }}>
                  Meta anual
                </p>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '600' 
                }}>
                  {prod.metaTotal}K USD
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280' 
                }}>
                  Ventas reales
                </p>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '600' 
                }}>
                  {prod.ventasTotal}K USD
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280' 
                }}>
                  Desviación
                </p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: prod.desviacion >= 0 ? '#059669' : '#dc2626'
                }}>
                  {prod.desviacion.toFixed(2)}%
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280' 
                }}>
                  Meses positivos
                </p>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '600' 
                }}>
                  {prod.mesesPositivos} / {prod.totalMeses}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDashboard;