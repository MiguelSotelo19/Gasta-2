export const validarDatosReporte = (expenseData, categoryData, lineData, nombreEspacio) => {
  const errores = [];

  if (!nombreEspacio || nombreEspacio.trim() === '') {
    errores.push('El nombre del espacio es requerido');
  }

  if (!categoryData || categoryData.length === 0) {
    errores.push('Debe haber al menos una categoría con datos');
  }

  if (!lineData || lineData.length === 0) {
    errores.push('Debe haber al menos un usuario con aportes');
  }

  if (!expenseData || expenseData.length === 0) {
    errores.push('Debe haber al menos un gasto registrado');
  }

  // Validar que las categorías tengan montos válidos
  if (categoryData) {
    const categoriasInvalidas = categoryData.filter(cat => 
      !cat.value || cat.value <= 0 || !cat.name || cat.name.trim() === ''
    );
    if (categoriasInvalidas.length > 0) {
      errores.push('Todas las categorías deben tener nombre y monto válidos');
    }
  }

  // Validar que los usuarios tengan aportes válidos
  if (lineData) {
    const usuariosInvalidos = lineData.filter(user => 
      !user.name || user.name.trim() === '' || !user.dataPoints || user.dataPoints.length === 0
    );
    if (usuariosInvalidos.length > 0) {
      errores.push('Todos los usuarios deben tener nombre y al menos un aporte');
    }
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};