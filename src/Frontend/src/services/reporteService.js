import axiosInstance from './axiosInstance';

export const reporteService = {
  // Generar y descargar Excel
  async generarExcel(datosReporte) {
    try {
      const response = await axiosInstance.post('/api/reportes/excel', datosReporte, {
        responseType: 'blob', // Importante para archivos binarios
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Crear blob y descargar archivo
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extraer nombre del archivo del header si está disponible
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'reporte.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Excel generado exitosamente' };
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw new Error(error.response?.data?.message || 'Error generando el reporte Excel');
    }
  },

  // Preview del reporte
  async previewReporte(datosReporte) {
    try {
      const response = await axiosInstance.post('/api/reportes/preview', datosReporte);
      return response.data;
    } catch (error) {
      console.error('Error generando preview:', error);
      throw new Error(error.response?.data?.message || 'Error generando preview');
    }
  }
};