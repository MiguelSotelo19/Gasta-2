import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Checkbox } from "../../components/ui/checkbox"
import { Mail, Lock, User, DollarSign, CheckCircle } from "lucide-react"
import axiosInstance from "../../services/axiosInstance"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function Registrarse() {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlCreateUser = `${API_URL}/api/usuarios/registrar`;
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (error) setError("")
  }

  const validateForm = () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      return "Por favor completa todos los campos"
    }
    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden"
    }
    if (formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }
    if (!formData.acceptTerms) {
      return "Debes aceptar los términos y condiciones"
    }

    if(!regexCorreo.test(formData.email)){
      return "El correo electrónico debe de ser uno válido"
    }
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validationError = validateForm()
    if (validationError) {
      toast.warn(validationError);
      setIsLoading(false)
      return
    }

    setTimeout(async () => {
      try {
        const respuesta = await axiosInstance.post(urlCreateUser, {
            nombreusuario : formData.username,
            correo : formData.email,
            contrasenia : formData.password,
            espaciosdisponibles : 5,
            status : true
        })

        if (respuesta && respuesta.status == 201) {          
          setSuccess(true)
          setIsLoading(false)
        }
      } catch(e) {
          toast.warn("Algo salió mal, trabajaremos en ello lo antes posible")
          setIsLoading(false)
      }
    }, 1000)
  }

  if (success) {
    return ( 
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta Creada!</h2>
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido creada exitosamente.
            </p>
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/")}>
              <p style={{ color: "white" }}>Ir al login</p>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Gasta-2</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">Únete y comienza a gestionar tus gastos compartidos</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Por qué elegir Gasta-2?</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Divide gastos automáticamente</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Rastrea deudas y pagos</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Reportes detallados</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Notificaciones inteligentes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="relative">
          {/* Artistic border design */}
          <div className="absolute inset-0 -m-8 hidden lg:block">
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-20">
              <path
                d="M200 50 C300 50, 350 100, 350 200 C350 300, 300 350, 200 350 C100 350, 50 300, 50 200 C50 100, 100 50, 200 50 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <path
                d="M200 40 C310 40, 360 90, 360 200 C360 310, 310 360, 200 360 C90 360, 40 310, 40 200 C40 90, 90 40, 200 40 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Register Card */}
          <Card className="relative bg-white shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Gasta-2</h1>
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Crear Cuenta</CardTitle>
              <CardDescription>Regístrate para comenzar a gestionar tus gastos compartidos</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">                

                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="tu_usuario"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    &nbsp;&nbsp;Acepto los{" "}
                    <a href="/terms" className="text-blue-500 hover:underline">
                      Términos de Servicio
                    </a>{" "}
                    y la{" "}
                    <a href="/privacy" className="text-blue-500 hover:underline">
                      Política de Privacidad
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                <a href="/" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
                  Iniciar Sesión
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
    </div>
  )
}