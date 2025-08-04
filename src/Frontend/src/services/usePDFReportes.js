import { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';

export const usePDFReportes = () => {
  const [loading, setLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const generarPDFPreview = async (reportData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/reportes/pdf/preview`,
        reportData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfPreview(pdfUrl);
      
      return pdfUrl;
    } catch (error) {
      console.error('Error generando preview PDF:', error);
      toast.error('Error al generar el preview del PDF');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async (reportData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/reportes/pdf`,
        reportData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(pdfBlob);
      
      // Crear enlace temporal para descarga
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `reporte_gastos_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL temporal
      URL.revokeObjectURL(downloadUrl);
      
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const prepararDatosReporte = (
    expenseData, 
    categoryData, 
    lineData, 
    nombreEspacio, 
    selectedPeriod, 
    totalExpenses, 
    averageExpense, 
    cantPagos
  ) => {
    return {
      expenseData,
      categoryData,
      lineData,
      nombreEspacio,
      selectedPeriod,
      totalExpenses,
      averageExpense,
      cantPagos: cantPagos.length
    };
  };

  const limpiarPreview = () => {
    if (pdfPreview) {
      URL.revokeObjectURL(pdfPreview);
      setPdfPreview(null);
    }
  };

  return {
    loading,
    pdfPreview,
    generarPDFPreview,
    generarPDF,
    prepararDatosReporte,
    limpiarPreview
  };
};