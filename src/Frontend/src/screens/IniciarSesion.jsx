import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Link } from "react-router-dom"
import { Mail, Lock, DollarSign, Users, PieChart } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { auth } from "../services/authService"

export default function IniciarSesion() {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlSignIn = `${API_URL}/api/auth/signin`
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(async () => {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formData.email || !formData.password){
        toast.warn("Por favor, ingresa tu correo y contraseña")
        return;
      }

      if (!regexCorreo.test(formData.email)) {
        toast.warn("El correo electrónico debe de ser uno válido")
        return;
      }

      try {
        const respuesta = await auth(formData.email, formData.password);

        if (respuesta && respuesta.data){
          toast.done("Inicio de sesión exitoso")
        }

      } catch(e) {
        toast.warn("Usuario y/o contraseña incorrectos.")
      }

      setIsLoading(false)
    }, 1000)
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
            <p className="text-xl text-gray-600 mb-8">Gestiona tus gastos compartidos de manera inteligente</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gastos en Grupo</h3>
                <p className="text-sm text-gray-600">Divide gastos con amigos y familia</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reportes Detallados</h3>
                <p className="text-sm text-gray-600">Visualiza tus gastos y balances</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Liquidación Automática</h3>
                <p className="text-sm text-gray-600">Calcula quién debe a quién</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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

          {/* Login Card */}
          <Card className="relative bg-white shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Gasta-2</h1>
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Iniciar Sesión</CardTitle>
              <CardDescription>Accede a tu cuenta para gestionar tus gastos compartidos</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50"
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
                      placeholder="Tu contraseña"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="flex justify-between items-center text-sm">
                <Link href="/forgot-password" className="text-blue-500 hover:text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
                <Link href="/register" className="text-blue-500 hover:text-blue-600 hover:underline">
                  Crear cuenta
                </Link>
              </div>

              <div className="text-center text-xs text-gray-500 pt-4 border-t">
                Al iniciar sesión, aceptas nuestros{" "}
                <Link href="/terms" className="text-blue-500 hover:underline">
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link href="/privacy" className="text-blue-500 hover:underline">
                  Política de Privacidad
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
