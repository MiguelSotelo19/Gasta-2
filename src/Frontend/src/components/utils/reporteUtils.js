export const procesarDatosParaReporte = (expenseData, categoryData, lineData, nombreEspacio, selectedPeriod, totalExpenses, averageExpense, cantPagos) => {
  // Procesar categorías
  const categorias = categoryData.map(cat => ({
    nombre: cat.name,
    monto: cat.value,
    porcentaje: cat.percentage,
    color: cat.color
  }));

  // Procesar aportes por usuario desde lineData
  const aportesPorUsuario = lineData.map(userLine => {
    const aportes = userLine.dataPoints.map(point => ({
      fecha: point.x.toISOString().split('T')[0], // Convertir Date a string YYYY-MM-DD
      monto: point.y
    }));

    const totalAportado = aportes.reduce((sum, aporte) => sum + aporte.monto, 0);

    return {
      usuario: userLine.name,
      aportes: aportes,
      totalAportado: totalAportado
    };
  });

  // Estadísticas generales
  const estadisticas = {
    totalGastos: totalExpenses,
    promedioGasto: averageExpense,
    totalRegistros: cantPagos.length,
    categoriasActivas: categoryData.length
  };

  return {
    categorias,
    aportesPorUsuario,
    estadisticas,
    nombreEspacio,
    periodo: selectedPeriod === 'month' ? 'Este mes' : 'Dos meses'
  };
};