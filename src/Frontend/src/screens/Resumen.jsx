import { useEffect, useState } from "react"
import axiosInstance from "../services/axiosInstance";
import "./css/espacio.css"
import "./css/general.css"

export default function Resumen({ espacioActual, nombreEspacio }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlGastos = `${API_URL}/api/gastos/espacio/${espacioActual.idEspacio}`;
  const urlCategorias = `${API_URL}/api/categorias/${espacioActual.idEspacio}`;
  const usuarioActual = localStorage.getItem("userName")

  const [categorias, setCategorias] = useState([]);
  const [gastosRecientes, setGastosRecientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalMes: 0,
    miContribucion: 0,
    gastosRegistrados: 0,
    miembrosActivos: 0
  });

  const getData = async () => {
    const response = await axiosInstance.get(urlGastos);
    const categoriasResponse = await axiosInstance.get(urlCategorias);
    const categorias = categoriasResponse.data.data;
    const historicos = response.data.data;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaLimite = new Date(hoy);
    fechaLimite.setMonth(hoy.getMonth() - 2);
    const soloFecha = (date) => date.toISOString().split('T')[0];

    const gastosFiltrados = historicos.filter(h => {
      const fechaGasto = new Date(h.fecha);
      const fechaGastoStr = soloFecha(fechaGasto);
      const hoyStr = soloFecha(hoy);
      const limiteStr = soloFecha(fechaLimite);

      return fechaGastoStr >= limiteStr && fechaGastoStr <= hoyStr;
    });

    const gastosUnicos = Array.from(
      new Map(gastosFiltrados.map(g => [g.idGasto, g])).values()
    );

    const total = gastosUnicos.reduce((acc, curr) => acc + curr.cantidad, 0);

    const categoryTotals = {};
    const categoryExpenses = {};
    
    gastosUnicos.forEach(h => {
      const cat = h.nombreTipoGasto;
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = 0;
        categoryExpenses[cat] = 0;
      }
      categoryTotals[cat] += h.cantidad;
      categoryExpenses[cat] += 1;
    });

    const categoryTypeMap = {
      'Comida': 'food',
      'Energetico': 'energy',
      'Energéticas': 'energy',
      'Personales': 'personal',
      'Transporte': 'transport'
    };

    const finalCategorias = Object.entries(categoryTotals).map(([name, total]) => ({
      name,
      type: categoryTypeMap[name] || 'other',
      expenses: categoryExpenses[name],
      total: total
    }));

    const gastosRecientesData = gastosFiltrados.map((h) => ({
      id: h.idGasto,
      description: h.descripcion,
      amount: h.montoPago,
      date: h.fecha,
      user: h.nombreUsuario,
      category: h.nombreTipoGasto,
      status: h.estatusPago
    }));

    const miContribucion = gastosUnicos
      .filter(g => g.nombreUsuario === usuarioActual)
      .reduce((acc, curr) => acc + curr.cantidad, 0);

    const usuariosUnicos = [...new Set(gastosUnicos.map(g => g.nombreUsuario))];

    const estadisticasCalculadas = {
      totalMes: total,
      miContribucion: miContribucion,
      gastosRegistrados: gastosUnicos.length,
      miembrosActivos: usuariosUnicos.length
    };

    setCategorias(finalCategorias);
    setGastosRecientes(gastosRecientesData);
    setEstadisticas(estadisticasCalculadas);
  };

  useEffect(() => {
    getData()
  }, [espacioActual])

  const porcentajeContribucion = estadisticas.totalMes > 0 
    ? Math.round((estadisticas.miContribucion / estadisticas.totalMes) * 100)
    : 0;

  return (
    <>
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Panel principal</h1>
            <p>Resumen de gastos del espacio: {nombreEspacio}</p>
          </div>
          <button className="primary-button">
            <span>+</span>
            Agregar Gasto
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-header">Total del Mes</div>
            <div className="stat-value">${estadisticas.totalMes.toLocaleString()}</div>
            <div className="stat-change positive">
              <span>📈</span>
              Últimos 2 meses
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-header">Mi Contribución</div>
            <div className="stat-value">${estadisticas.miContribucion.toLocaleString()}</div>
            <div className="stat-change neutral">{porcentajeContribucion}% del total</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-header">Gastos Registrados</div>
            <div className="stat-value">{estadisticas.gastosRegistrados}</div>
            <div className="stat-change neutral">Últimos 2 meses</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-header">Miembros Activos</div>
            <div className="stat-value">{estadisticas.miembrosActivos}</div>
            <div className="stat-change neutral">En este espacio</div>
          </div>
        </div>

        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span>📊</span>
                Gastos por Categoría
              </h3>
            </div>
            <div className="card-content">
              {categorias.length > 0 ? (
                categorias.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <span className={`category-badge ${category.type}`}>{category.name}</span>
                      <span className="category-count">{category.expenses} gastos</span>
                    </div>
                    <span className="category-amount">${category.total.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p>No hay gastos registrados en este periodo</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span>📅</span>
                Gastos Recientes
              </h3>
            </div>
            <div className="card-content">
              {gastosRecientes.length > 0 ? (
                gastosRecientes.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-info">
                      <h4>{expense.description}</h4>
                      <div className="expense-meta">
                        {expense.user} • {expense.date}
                      </div>
                    </div>
                    <div className="expense-amount">
                      <div className="amount">${expense.amount.toLocaleString()}</div>
                      <span className="expense-category">{expense.category}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay gastos recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>      
    </>
  )
}