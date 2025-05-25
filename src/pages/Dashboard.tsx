import { useState } from "react";
import { LineChart, BarChart, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import './Dashboard.css'
import * as XLSX from "xlsx";
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
  const [data, setData] = useState<any[]>([]);
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

  const [selectedProducts, setSelectedProducts] = useState({
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws);
        setData(parsedData as any[]);
      };
      reader.readAsBinaryString(file);
    };
  
  return (
    <div className="font-sans bg-gray-50 p-6 rounded-lg">
      {/* Encabezado del Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Rendimiento de Productos</h1>
        <p className="text-lg text-gray-600">Análisis comparativo de metas y ventas reales</p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Cargar archivo Excel:</label>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
        />
      </div>

      {/* Filtros de Productos */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="font-semibold text-gray-700 self-center">Filtrar productos:</span>
        <div className="flex gap-3">
          <button 
            onClick={() => handleProductToggle("Producto A")}
            className="px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: selectedProducts["Producto A"] ? colors.primary : "#9CA3AF" }}
          >
            Producto A
          </button>
          <button 
            onClick={() => handleProductToggle("Producto B")}
            className="px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: selectedProducts["Producto B"] ? colors.secondary : "#9CA3AF" }}
          >
            Producto B
          </button>
          <button 
            onClick={() => handleProductToggle("Producto C")}
            className="px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: selectedProducts["Producto C"] ? colors.tertiary : "#9CA3AF" }}
          >
            Producto C
          </button>
        </div>
      </div>

      {/* Grid de visualizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" >
        {/* Gráfico 1: Metas vs Ventas Reales */}
        <div className="bg-white p-4 rounded-lg shadow" >
          <h2 className="text-xl font-bold text-gray-800 mb-1">Tendencia de Ventas: Meta vs Real</h2>
          <p className="text-sm text-gray-500 mb-4">Comparativa mensual de objetivos y resultados</p>
          <div className="h-64" style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} style={{ width: '100%', height: '100%' }}>
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
          <div  style={{ width: '100%', height: '400px' }}>
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

        {/* Gráfico 3: Resumen Anual por Producto */}
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2" >
          <h2 className="text-xl font-bold text-gray-800 mb-1">Desempeño Anual por Producto</h2>
          <p className="text-sm text-gray-500 mb-4">Comparativa de metas anuales vs ventas acumuladas</p>
          <div className="h-64" style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumenProductos.filter(p => selectedProducts[p.producto as ProductName]) }>
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

      {/* KPIs y Métricas Clave */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumenProductos.map((prod) => (
          selectedProducts[prod.producto as ProductName] && (
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