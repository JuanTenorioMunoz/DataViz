import { useState } from "react";
import { LineChart, BarChart, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ProductDashboard() {
  // Paleta de colores corporativos y derivados
  const colors = {
    primary: "#00a89c",    // Verde-azulado
    secondary: "#9654e5",  // Púrpura
    tertiary: "#ff8800",   // Naranja
    
    // Colores análogos y complementarios
    primaryLight: "#4fbdb5",
    primaryDark: "#007a71",
    secondaryLight: "#b78aed",
    secondaryDark: "#6e3eba",
    tertiaryLight: "#ffaa4d",
    tertiaryDark: "#cc6a00",
  };

  // Datos mensuales de ventas
  const data = [
    { mes: "Ene", "Meta A": 10, "Real A": 9.8, "Meta B": 8, "Real B": 7.5, "Meta C": 10.5, "Real C": 10, "Dev A": -2.00, "Dev B": -6.25, "Dev C": -4.76 },
    { mes: "Feb", "Meta A": 11, "Real A": 11.5, "Meta B": 8.5, "Real B": 8.2, "Meta C": 11, "Real C": 10.8, "Dev A": 4.55, "Dev B": -3.53, "Dev C": -1.82 },
    { mes: "Mar", "Meta A": 12, "Real A": 12.3, "Meta B": 9, "Real B": 8.9, "Meta C": 11.5, "Real C": 11, "Dev A": 2.50, "Dev B": -1.11, "Dev C": -4.35 },
    { mes: "Abr", "Meta A": 10.5, "Real A": 10, "Meta B": 8.5, "Real B": 8.2, "Meta C": 11, "Real C": 10.5, "Dev A": -4.76, "Dev B": -3.53, "Dev C": -4.55 },
    { mes: "May", "Meta A": 13, "Real A": 13.5, "Meta B": 9, "Real B": 8.7, "Meta C": 12, "Real C": 11.8, "Dev A": 3.85, "Dev B": -3.33, "Dev C": -1.67 },
    { mes: "Jun", "Meta A": 14, "Real A": 14.5, "Meta B": 9.5, "Real B": 9, "Meta C": 13, "Real C": 12.8, "Dev A": 3.57, "Dev B": -5.26, "Dev C": -1.54 },
    { mes: "Jul", "Meta A": 12, "Real A": 12, "Meta B": 8.8, "Real B": 8.5, "Meta C": 11, "Real C": 10.5, "Dev A": 0.00, "Dev B": -3.41, "Dev C": -4.55 },
    { mes: "Ago", "Meta A": 13.5, "Real A": 13, "Meta B": 9.5, "Real B": 9.2, "Meta C": 12.5, "Real C": 12.2, "Dev A": -3.70, "Dev B": -3.16, "Dev C": -2.40 },
    { mes: "Sep", "Meta A": 11.5, "Real A": 11, "Meta B": 9, "Real B": 8.7, "Meta C": 11, "Real C": 10.5, "Dev A": -4.35, "Dev B": -3.33, "Dev C": -4.55 },
    { mes: "Oct", "Meta A": 12.5, "Real A": 12.3, "Meta B": 9.2, "Real B": 9, "Meta C": 12, "Real C": 11.5, "Dev A": -1.60, "Dev B": -2.17, "Dev C": -4.17 },
    { mes: "Nov", "Meta A": 10, "Real A": 9.7, "Meta B": 8.5, "Real B": 8.3, "Meta C": 10.5, "Real C": 10.2, "Dev A": -3.00, "Dev B": -2.35, "Dev C": -2.86 },
    { mes: "Dic", "Meta A": 15, "Real A": 14.8, "Meta B": 10.5, "Real B": 10, "Meta C": 14, "Real C": 13.5, "Dev A": -1.33, "Dev B": -4.76, "Dev C": -3.57 }
  ];

  // Datos sumarios por producto para el año completo
  const resumenProductos = [
    { 
      producto: "Producto A", 
      metaTotal: 145, 
      ventasTotal: 144.4, 
      desviacion: -0.41, 
      mesesPositivos: 4,
      color: colors.primary
    },
    { 
      producto: "Producto B", 
      metaTotal: 108, 
      ventasTotal: 104.2, 
      desviacion: -3.52, 
      mesesPositivos: 0,
      color: colors.secondary
    },
    { 
      producto: "Producto C", 
      metaTotal: 140, 
      ventasTotal: 135.3, 
      desviacion: -3.36, 
      mesesPositivos: 0,
      color: colors.tertiary
    }
  ];

  // Datos de desviación mensual por producto
  const dataDesviacion = data.map(item => ({
    mes: item.mes,
    "Producto A": item["Dev A"],
    "Producto B": item["Dev B"],
    "Producto C": item["Dev C"]
  }));

    type ProductName = "Producto A" | "Producto B" | "Producto C";

    const [selectedProducts, setSelectedProducts] = useState<Record<ProductName, boolean>>({
    "Producto A": true,
    "Producto B": true,
    "Producto C": true
    });


  // Manejar cambios en la selección de productos
  const handleProductToggle = (product: ProductName) => {
    setSelectedProducts({
      ...selectedProducts,
      [product]: !selectedProducts[product]
    });
  };

  return (
    <div className="font-sans bg-gray-50 p-6 rounded-lg">
      {/* Encabezado del Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Rendimiento de Productos</h1>
        <p className="text-lg text-gray-600">Análisis comparativo de metas y ventas reales</p>
      </div>

      {/* Filtros de Productos */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="font-semibold text-gray-700 self-center">Filtrar productos:</span>
        <div className="flex gap-3">
          <button 
            onClick={() => handleProductToggle("Producto A")}
            className={`px-3 py-1 rounded-full text-white ${selectedProducts["Producto A"] ? `bg-[${colors.primary}]` : "bg-gray-400"}`}
            style={{ backgroundColor: selectedProducts["Producto A"] ? colors.primary : "#9CA3AF" }}
          >
            Producto A
          </button>
          <button 
            onClick={() => handleProductToggle("Producto B")}
            className={`px-3 py-1 rounded-full text-white ${selectedProducts["Producto B"] ? `bg-[${colors.secondary}]` : "bg-gray-400"}`}
            style={{ backgroundColor: selectedProducts["Producto B"] ? colors.secondary : "#9CA3AF" }}
          >
            Producto B
          </button>
          <button 
            onClick={() => handleProductToggle("Producto C")}
            className={`px-3 py-1 rounded-full text-white ${selectedProducts["Producto C"] ? `bg-[${colors.tertiary}]` : "bg-gray-400"}`}
            style={{ backgroundColor: selectedProducts["Producto C"] ? colors.tertiary : "#9CA3AF" }}
          >
            Producto C
          </button>
        </div>
      </div>

      {/* Grid de visualizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico 1: Metas vs Ventas Reales */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Tendencia de Ventas: Meta vs Real</h2>
          <p className="text-sm text-gray-500 mb-4">Comparativa mensual de objetivos y resultados</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis 
                  label={{ 
                    value: 'USD (K)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fontSize: 12 } 
                  }} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [`${value}K USD`, null]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                
                {selectedProducts["Producto A"] && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="Meta A" 
                      name="Meta A" 
                      stroke={colors.primaryDark} 
                      strokeWidth={2}
                      strokeDasharray="5 5" 
                      dot={{ r: 3 }} 
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Real A" 
                      name="Real A" 
                      stroke={colors.primary} 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      activeDot={{ r: 5 }}
                    />
                  </>
                )}
                
                {selectedProducts["Producto B"] && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="Meta B" 
                      name="Meta B" 
                      stroke={colors.secondaryDark} 
                      strokeWidth={2}
                      strokeDasharray="5 5" 
                      dot={{ r: 3 }} 
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Real B" 
                      name="Real B" 
                      stroke={colors.secondary} 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      activeDot={{ r: 5 }}
                    />
                  </>
                )}
                
                {selectedProducts["Producto C"] && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="Meta C" 
                      name="Meta C" 
                      stroke={colors.tertiaryDark} 
                      strokeWidth={2}
                      strokeDasharray="5 5" 
                      dot={{ r: 3 }} 
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Real C" 
                      name="Real C" 
                      stroke={colors.tertiary} 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      activeDot={{ r: 5 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Desviación porcentual */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Desviación Porcentual vs Meta</h2>
          <p className="text-sm text-gray-500 mb-4">Rendimiento mensual por encima/debajo del objetivo</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dataDesviacion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis 
                  label={{ value: '%', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
                  domain={[-8, 8]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => { if (typeof value === 'number') {
                    return value.toFixed(2) + '%';  }   
                    return value;}} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                
                {/* Línea de referencia en cero */}
                <CartesianGrid y={0} stroke="#000" strokeWidth={1} />
                
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

        {/* Gráfico 3: Resumen Anual por Producto */}
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Desempeño Anual por Producto</h2>
          <p className="text-sm text-gray-500 mb-4">Comparativa de metas anuales vs ventas acumuladas</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumenProductos.filter(p => selectedProducts[p.product])}>
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
                    if (name === "desviacion") return [`${value.toFixed(2)}%`, "Desviación"];
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

      {/* KPIs y Métricas Clave */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumenProductos.map((prod) => (
          selectedProducts[prod.producto] && (
            <div 
              key={prod.producto} 
              className="bg-white p-4 rounded-lg shadow"
              style={{ borderLeft: `4px solid ${prod.color}` }}
            >
              <h3 className="text-lg font-bold text-gray-800">{prod.producto}</h3>
              <div className="grid grid-cols-2 gap-y-2 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Meta anual</p>
                  <p className="text-lg font-semibold">{prod.metaTotal}K USD</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ventas reales</p>
                  <p className="text-lg font-semibold">{prod.ventasTotal}K USD</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Desviación</p>
                  <p className={`text-lg font-semibold ${prod.desviacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prod.desviacion.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Meses positivos</p>
                  <p className="text-lg font-semibold">{prod.mesesPositivos} / 12</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}