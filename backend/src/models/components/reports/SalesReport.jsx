import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

// PATRÓN DECORATOR para mejorar reportes
const withCharts = (ReportComponent) => {
  return function EnhancedReport(props) {
    const [chartData, setChartData] = useState([]);
    
    const processDataForCharts = (reportData) => {
      // Transformar datos para gráficos
      const salesByDay = reportData.dailySales || [];
      const productSales = reportData.topProducts.map(([id, data]) => ({
        name: `Producto ${id}`,
        ventas: data.quantity,
        ingresos: data.revenue
      }));
      
      return { salesByDay, productSales };
    };
    
    return (
      <div className="enhanced-report">
        <ReportComponent {...props} onDataProcessed={processDataForCharts} />
        {chartData.length > 0 && (
          <div className="report-charts">
            <h3>Visualizaciones</h3>
            {/* Gráficos aquí */}
          </div>
        )}
      </div>
    );
  };
};

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await reportService.getSalesReport(dateRange);
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Generando reporte...</div>;
  if (!report) return <div className="error">No se pudo cargar el reporte</div>;

  // Datos para gráficos
  const chartData = report.topProducts.slice(0, 5).map(([id, data], index) => ({
    name: `Producto ${id}`,
    cantidad: data.quantity,
    ingresos: data.revenue
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="sales-report">
      <div className="report-header">
        <h1>Reporte de Ventas</h1>
        <div className="date-selector">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
          />
          <span>a</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
          />
          <button onClick={loadReport} className="btn btn-primary">
            <i className="fas fa-refresh"></i> Actualizar
          </button>
        </div>
      </div>

      {/* Resumen principal */}
      <div className="summary-cards">
        <div className="summary-card total-sales">
          <h3>Ventas Totales</h3>
          <div className="amount">${report.summary.totalSales.toFixed(2)}</div>
          <small>Período: {dateRange.startDate} - {dateRange.endDate}</small>
        </div>
        
        <div className="summary-card total-orders">
          <h3>Total Órdenes</h3>
          <div className="amount">{report.summary.totalOrders}</div>
          <small>{report.summary.averageOrderValue.toFixed(2)} por orden</small>
        </div>
        
        <div className="summary-card avg-order">
          <h3>Valor Promedio</h3>
          <div className="amount">${report.summary.averageOrderValue.toFixed(2)}</div>
          <small>Por orden</small>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#8884d8" name="Cantidad Vendida" />
              <Bar dataKey="ingresos" fill="#82ca9d" name="Ingresos ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(report.ordersByStatus).map(([status, count]) => ({
                  name: status,
                  value: count
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(report.ordersByStatus).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="detailed-section">
        <h3>Clientes Frecuentes (Top 5)</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Cliente ID</th>
              <th>Total de Órdenes</th>
              <th>Total Gastado</th>
              <th>Promedio por Orden</th>
            </tr>
          </thead>
          <tbody>
            {report.topCustomers.map(([customerId, data], index) => (
              <tr key={customerId}>
                <td>{customerId}</td>
                <td>{data.orders}</td>
                <td>${data.totalSpent.toFixed(2)}</td>
                <td>${(data.totalSpent / data.orders).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para exportar */}
      <div className="export-section">
        <button className="btn btn-secondary">
          <i className="fas fa-download"></i> Exportar a PDF
        </button>
        <button className="btn btn-secondary">
          <i className="fas fa-file-excel"></i> Exportar a Excel
        </button>
      </div>
    </div>
  );
};

// Aplicar Decorator Pattern
export default withCharts(SalesReport);
