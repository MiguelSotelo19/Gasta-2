import "./css/general.css"
import "./css/reportes.css"

export const Reportes = ({ espacioActual, nombreEspacio }) =>{
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
  
    return(
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
            </div>
          </div>
        </>
    )
}