import { useState } from 'react';
import { reporteService } from '../services/reporteService';
import { procesarDatosParaReporte } from '../components/utils/reporteUtils';
import { toast } from 'react-toastify';

export const useReportes = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const generarExcel = async (expenseData, categoryData, lineData, nombreEspacio, selectedPeriod, totalExpenses, averageExpense, cantPagos) => {
    setLoading(true);
    try {
      // Procesar datos
      const datosReporte = procesarDatosParaReporte(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );

      // Generar Excel
      const result = await reporteService.generarExcel(datosReporte);
      toast.success(result.message);
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generarPreview = async (expenseData, categoryData, lineData, nombreEspacio, selectedPeriod, totalExpenses, averageExpense, cantPagos) => {
    setLoading(true);
    try {
      // Procesar datos
      const datosReporte = procesarDatosParaReporte(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );

      // Generar preview
      const previewData = await reporteService.previewReporte(datosReporte);
      setPreview(previewData);
      return previewData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    preview,
    generarExcel,
    generarPreview,
    setPreview
  };
};