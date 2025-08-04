import "./css/general.css"
import "./css/reportes.css"

import { useEffect, useState } from "react"
import axiosInstance from "../services/axiosInstance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { toast, ToastContainer } from "react-toastify"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { BarChart3, PieChart, DollarSign, TrendingUp, Tag, Download, Eye, FileSpreadsheet, FileText } from "lucide-react"
import Pastel from "../components/Pastel"
import LineChart from "../components/LineChart"
import { useReportes } from '../services/useReportes';
import { usePDFReportes } from '../services/usePDFReportes';
import ReportePreviewModal from '../components/ReportePreviewModal';
import PDFPreviewModal from '../components/PDFPreviewModal';
import ReporteValidationAlert from '../components/ReporteValidationAlert';
import { validarDatosReporte } from '../components/utils/validacionReporte';

const tailwindToHexMap = {
  "bg-pink-500": "#ec4899", "bg-blue-500": "#3b82f6", "bg-purple-500": "#8b5cf6",
  "bg-amber-500": "#f59e0b", "bg-green-500": "#22c55e", "bg-neutral-500": "#737373",
  "bg-red-500": "#ef4444", "bg-yellow-500": "#eab308", "bg-indigo-500": "#6366f1",
  "bg-teal-500": "#14b8a6","bg-orange-500": "#f97316", "bg-stone-500": "#78716c",
  "bg-rose-500": "#f43f5e", "bg-emerald-500": "#10b981", "bg-cyan-500": "#06b6d4",
  "bg-zinc-500": "#71717a", "bg-lime-500": "#84cc16", "bg-fuchsia-500": "#d946ef",
  "bg-sky-500": "#0ea5e9", "bg-violet-500": "#8b5cf6", "bg-slate-500": "#64748b",
};

const coloresDisponibles = [
  "bg-pink-500", "bg-blue-500", "bg-purple-500", "bg-amber-500",
  "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-neutral-500",
  "bg-indigo-500", "bg-teal-500", "bg-orange-500", "bg-stone-500",
  "bg-rose-500", "bg-emerald-500", "bg-cyan-500", "bg-zinc-500",
  "bg-lime-500", "bg-fuchsia-500", "bg-sky-500", "bg-violet-500",
  "bg-slate-500"
];

export const Reportes = ({ espacioActual, nombreEspacio }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlGastos = `${API_URL}/api/gastos/espacio/${espacioActual.idEspacio}`;
  const urlCategorias = `${API_URL}/api/categorias/${espacioActual.idEspacio}`;

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  const [cantPagos, setCantPagos] = useState([])
  const [lineData, setLineData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [datos, setDatos] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  // Estados para reportes Excel
  const { loading: reporteLoading, preview, generarExcel, generarPreview, setPreview } = useReportes();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Estados para reportes PDF
  const { 
    loading: pdfLoading, 
    pdfPreview, 
    generarPDFPreview, 
    generarPDF, 
    prepararDatosReporte,
    limpiarPreview 
  } = usePDFReportes();
  const [showPDFPreviewModal, setShowPDFPreviewModal] = useState(false);
  
  const [validacionDatos, setValidacionDatos] = useState({ esValido: false, errores: [] });

  const getData = async () => {
    const response = await axiosInstance.get(urlGastos);
    const categoriasResponse = await axiosInstance.get(urlCategorias);
    const categorias = categoriasResponse.data.data;
    const historicos = response.data.data;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaLimite = new Date(hoy);
    
    if (selectedPeriod === "custom") {
      fechaLimite.setMonth(hoy.getMonth() - 2);
    } else {
      fechaLimite.setDate(1);
    }

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

    let coloresRestantes = [...coloresDisponibles];
    const categoriaColorMap = {};

    categorias.forEach(c => {
      if (coloresRestantes.length === 0) {
        coloresRestantes = [...coloresDisponibles];
      }

      const colorIndex = Math.floor(Math.random() * coloresRestantes.length);
      const color = coloresRestantes.splice(colorIndex, 1)[0];
      categoriaColorMap[c.nombre] = color;
    });

    const arrayData = gastosFiltrados.map((h, index) => ({
      id: index,
      description: h.descripcion,
      amount: h.montoPago,
      date: h.fecha,
      user: h.nombreUsuario,
      category: h.nombreTipoGasto,
      status: h.estatusPago,
      categoryColor: categoriaColorMap[h.nombreTipoGasto] || "bg-gray-400",
    }));
    setExpenseData(arrayData);

    const total = gastosUnicos.reduce((acc, curr) => acc + curr.cantidad, 0);

    const categoryTotals = {};
    gastosUnicos.forEach(h => {
      const cat = h.nombreTipoGasto;
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = 0;
      }
      categoryTotals[cat] += h.cantidad;
    });

    const finalCategoryData = Object.entries(categoryTotals).map(([name, value]) => {
      const percentage = Math.round((value / total) * 100);
      const color = categoriaColorMap[name] || "bg-gray-400";
      return {
        name,
        value,
        percentage,
        color,
      };
    });

    const pastel = finalCategoryData.map(f => ({
      y: f.percentage,
      label: f.name,
      color: tailwindToHexMap[f.color] || "#d1d5db"
    }));
    setDatos(pastel);

    const pagosPorUsuarioPorDia = {};

    gastosFiltrados.forEach(g => {
      if (!g.estatusPago) return;

      const fecha = new Date(g.fecha);
      const dia = fecha.toISOString().split("T")[0];
      const usuario = g.nombreUsuario;

      if (!pagosPorUsuarioPorDia[usuario]) {
        pagosPorUsuarioPorDia[usuario] = {};
      }

      if (!pagosPorUsuarioPorDia[usuario][dia]) {
        pagosPorUsuarioPorDia[usuario][dia] = 0;
      }

      pagosPorUsuarioPorDia[usuario][dia] += g.montoPago;
    });

    const lineas = Object.entries(pagosPorUsuarioPorDia).map(([usuario, pagos]) => {
      const dataPoints = Object.entries(pagos).map(([fechaStr, total]) => {
        const [year, month, day] = fechaStr.split("-").map(Number);
        return {
          x: new Date(year, month - 1, day),
          y: total
        };
      });

      return {
        type: "spline",
        name: usuario,
        showInLegend: true,
        xValueFormatString: "DD MMM",
        yValueFormatString: "$#,###.#",
        dataPoints: dataPoints.sort((a, b) => a.x - b.x)
      };
    });
    setLineData(lineas);
    setCategoryData(finalCategoryData);

    const uniqueExpensesMap = new Map();
    gastosFiltrados.forEach(expense => {
      if (!uniqueExpensesMap.has(expense.idGasto)) {
        uniqueExpensesMap.set(expense.idGasto, expense);
      }
    });

    const uniqueExpenses = Array.from(uniqueExpensesMap.values());
    const totalExpenses = uniqueExpenses.reduce((sum, expense) => sum + expense.cantidad, 0);
    
    setCantPagos(uniqueExpenses);
    setTotalExpenses(totalExpenses);
    setAverageExpense(totalExpenses / uniqueExpenses.length);

    if (historicos == null || gastosFiltrados.length == 0 || finalCategoryData.length == 0){
      toast.warn("No hay datos por mostrar en el periodo seleccionado");
    }

    // Validar datos después de cargarlos
    const validacion = validarDatosReporte(arrayData, finalCategoryData, lineas, nombreEspacio);
    setValidacionDatos(validacion);
  };

  useEffect(() => {
    getData();
  }, [selectedPeriod]);

  // Funciones para manejo de reportes Excel
  const handlePreview = async () => {
    const validacion = validarDatosReporte(expenseData, categoryData, lineData, nombreEspacio);
    if (!validacion.esValido) {
      toast.error("Por favor corrige los errores antes de generar el reporte");
      return;
    }

    try {
      setShowPreviewModal(true);
      await generarPreview(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );
    } catch (error) {
      setShowPreviewModal(false);
    }
  };

  const handleExport = async () => {
    const validacion = validarDatosReporte(expenseData, categoryData, lineData, nombreEspacio);
    if (!validacion.esValido) {
      toast.error("Por favor corrige los errores antes de generar el reporte");
      return;
    }

    try {
      await generarExcel(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );
    } catch (error) {
      console.error('Error exportando:', error);
    }
  };

  const handleConfirmDownload = async () => {
    try {
      await generarExcel(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );
      setShowPreviewModal(false);
      setPreview(null);
    } catch (error) {
      console.error('Error descargando:', error);
    }
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreview(null);
  };

  // Funciones para manejo de reportes PDF
  const handlePDFPreview = async () => {
    const validacion = validarDatosReporte(expenseData, categoryData, lineData, nombreEspacio);
    if (!validacion.esValido) {
      toast.error("Por favor corrige los errores antes de generar el reporte PDF");
      return;
    }

    try {
      setShowPDFPreviewModal(true);
      const reportData = prepararDatosReporte(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );
      await generarPDFPreview(reportData);
    } catch (error) {
      setShowPDFPreviewModal(false);
    }
  };

  const handlePDFExport = async () => {
    const validacion = validarDatosReporte(expenseData, categoryData, lineData, nombreEspacio);
    if (!validacion.esValido) {
      toast.error("Por favor corrige los errores antes de generar el reporte PDF");
      return;
    }

    try {
      const reportData = prepararDatosReporte(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );
      await generarPDF(reportData);
    } catch (error) {
      console.error('Error exportando PDF:', error);
    }
  };

  const handleConfirmPDFDownload = async () => {
    try {
      const reportData = prepararDatosReporte(
        expenseData, categoryData, lineData, nombreEspacio, 
        selectedPeriod, totalExpenses, averageExpense, cantPagos
      );
      await generarPDF(reportData);
      setShowPDFPreviewModal(false);
      limpiarPreview();
    } catch (error) {
      console.error('Error descargando PDF:', error);
    }
  };

  const handleClosePDFPreview = () => {
    setShowPDFPreviewModal(false);
    limpiarPreview();
  };

  return (
    <>
      <div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 mb-8">
            <Card className="relative bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Reportes
                </CardTitle>
                <CardDescription>
                  Visualiza reportes y estadísticas del espacio: {nombreEspacio}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* Alerta de validación */}
                  <ReporteValidationAlert validacion={validacionDatos} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <Label htmlFor="period">Período</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Este mes</SelectItem>
                        <SelectItem value="custom">Dos meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div></div>

                  {/* Botones Excel */}
                  <div className="flex items-end">
                    <Button 
                      className="primary-button w-full" 
                      onClick={handlePreview}
                      disabled={reporteLoading || !validacionDatos.esValido}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Excel
                    </Button>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      className="primary-button w-full" 
                      onClick={handleExport}
                      disabled={reporteLoading || !validacionDatos.esValido}
                    >
                      {reporteLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Exportar Excel
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Botones PDF */}
                  <div className="flex items-end">
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white w-full" 
                      onClick={handlePDFPreview}
                      disabled={pdfLoading || !validacionDatos.esValido}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview PDF
                    </Button>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white w-full" 
                      onClick={handlePDFExport}
                      disabled={pdfLoading || !validacionDatos.esValido}
                    >
                      {pdfLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Exportar PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resto del código existente para estadísticas y gráficas */}
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="relative bg-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gastos</p>
                    <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Promedio por Gasto</p>
                    <p className="text-2xl font-bold text-gray-900">${averageExpense.toFixed(0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Registros</p>
                    <p className="text-2xl font-bold text-gray-900">{cantPagos.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categorías Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficas existentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfica de Pastel */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Gráfica de Gastos por Categoría
                </CardTitle>
                <CardDescription>Distribución porcentual de gastos por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <Pastel datosCategorias={datos} />
              </CardContent>
            </Card>

            {/* Resumen por Categoría */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Resumen por Categoría</CardTitle>
                <CardDescription>Detalle de gastos por categoría en el período seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.percentage}% del total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${category.value.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Gráfica de Gastos por Usuario
                </CardTitle>
                <CardDescription>Distribución porcentual de gastos por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart LineData={lineData} />
              </CardContent>
            </Card>
          </div>

          {/* Tabla de historial existente */}
          <div className="reportes-container-reporte">          
            <div className="reportes-card-reporte reportes-full-width-reporte">
              <div className="reportes-card-header-reporte">
                <h3 className="reportes-card-title-reporte">
                  <span>📋</span>
                  Historial de Gastos Registrados
                </h3>
                <div className="reportes-table-info-reporte">
                  Mostrando {expenseData.length} gastos 
                </div>
              </div>
              <div className="reportes-card-content-reporte">
                <div className="reportes-table-container-reporte">
                  <table className="reportes-table-reporte">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Usuario</th>
                        <th>Cantidad</th>
                        <th>Pagado</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {expenseData.map((expense) => (
                        <tr key={expense.id}>
                          <td className="reportes-date-cell-reporte">{expense.date}</td>
                          <td className="reportes-description-cell-reporte">{expense.description}</td>
                          <td>
                            <span
                              className="reportes-category-badge-reporte"
                              style={{ backgroundColor: tailwindToHexMap[expense.categoryColor] + "20", color: tailwindToHexMap[expense.categoryColor] }}
                            >
                              {expense.category}
                            </span>
                          </td>
                          <td className="reportes-user-cell-reporte">{expense.user}</td>
                          <td className="reportes-amount-cell-reporte">${expense.amount.toLocaleString()}</td>
                          <td className="reportes-description-cell-reporte">{(expense.status) ? "Si" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de preview Excel */}
      <ReportePreviewModal
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        preview={preview}
        onConfirmDownload={handleConfirmDownload}
        loading={reporteLoading}
      />

      {/* Modal de preview PDF */}
      <PDFPreviewModal
        isOpen={showPDFPreviewModal}
        onClose={handleClosePDFPreview}
        pdfUrl={pdfPreview}
        onConfirmDownload={handleConfirmPDFDownload}
        loading={pdfLoading}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};