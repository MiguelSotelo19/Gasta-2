import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { toast, ToastContainer } from "react-toastify"
import { Mail, Lock, SearchCode, ArrowLeft, DollarSign, CheckCircle } from "lucide-react"
import axiosInstance from "../../services/axiosInstance"
//setSuccess(true)
export default function ForgotPassword() {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlVerifyEmail = `${API_URL}/api/usuarios/verify`
  const urlVerifyCode= `${API_URL}/api/usuarios/verify/code`
  const urlResetPassword = `${API_URL}/api/usuarios/verify/reset`
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingC, setIsLoadingC] = useState(false)
  const [isLoadingP, setIsLoadingP] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [verify, setVerify] = useState(false)
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email) {
      setError("Por favor ingresa tu correo electrónico")
      setIsLoading(false)
      return
    }
    setTimeout(async () => {
        try{
            const respuesta = await axiosInstance.post(urlVerifyEmail, {
                correo: email
            })

            if (respuesta && respuesta.status == 200){
                setSuccess(true)
                setIsLoading(false)
            }
        } catch(e) {
            console.error(e)
            toast.warn("Algo salió mal, trabajaremos en ello lo antes posible")
            setIsLoading(false)
        }
    }, 1500)
  }

  const handleSubmitCode = async (e) => {
    const regexCode = /^[0-9]{6}$/;
    e.preventDefault()
    setIsLoadingC(true)

    if (code.length !== 6) {
        toast.warn("El código debe ser de 6 carácteres");
    }

    if (!regexCode.test(code)) {
        toast.warn("El código debe ser de solo números")
    }

    setTimeout(async () => {
        try{
            const respuesta = await axiosInstance.post(urlVerifyCode, {
                correo: email,
                codigo: code
            })

            if (respuesta && respuesta.status == 200){
                toast.success("Código verificado correctamente")
                setVerify(true)
                setIsLoadingC(false)
            }
        } catch(e) {
            console.error(e)
            toast.warn("Algo salió mal, trabajaremos en ello lo antes posible")
            setVerify(false)
            setIsLoadingC(false)
        }
    }, 1500)
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()
    setIsLoadingP(true)

    if (password !== confirmPassword) {
        toast.warn("Las contraseñas no coinciden");
    }

    setTimeout(async () => {
        try{
            const respuesta = await axiosInstance.put(urlResetPassword, {
                correo: email,
                codigo: code,
                password: password
            })

            if (respuesta && respuesta.status == 200){
                toast.success("Contraseña restablecida correctamente")
                setIsLoading(false)
            }
        } catch(e) {
            console.error(e)
            toast.warn("Algo salió mal, trabajaremos en ello lo antes posible")
            setIsLoadingP(false)
        }
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email Enviado!</h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada e
              ingresa el código de recuperación a continuación.
            </p>

            <form onSubmit={handleSubmitCode}>
                <div className="space-y-3 mb-5">
                    <Label htmlFor="code">Código de recuperación</Label>
                    <div className="relative">
                    <SearchCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        id="code"
                        type="code"
                        placeholder="0000"
                        disabled={verify}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                        required
                    />
                    </div>
                </div>

                {(verify) ? (
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full bg-transparent mb-4"
                        disabled="true"
                    >
                        Enviar código de recuperación                       
                    </Button>
                ) : (
                    <Button
                    type="submit"
                    variant="outline"
                    className="w-full bg-transparent mb-4"
                    disabled={isLoadingC}
                >
                    {isLoadingC ? "Enviando..." : "Enviar código de recuperación"}                          
                </Button>
                )}
            </form>

            <form onSubmit={handleSubmitPassword}>
                {(verify) ? (
                    <>
                    <div className="space-y-3 mt-5 mb-3">
                        <Label htmlFor="password">Nueva contraseña</Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                            required
                        />
                        </div>
                    </div>

                    <div className="space-y-3 mb-5">
                        <Label htmlFor="confirmPassword">Repetir nueva contraseña</Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                            required
                        />
                        </div>
                    </div>
                    </>
                ) : (<></>)}

                <div className="space-y-3">
                    {(verify) ? (
                        <Button
                            type="submit"
                            variant="outline"
                            className="w-full bg-transparent"
                            disabled={isLoadingP}
                        >
                            {isLoadingP ? "Enviando..." : "Establecer nueva contraseña"}                            
                        </Button>
                    ): (<></>)}
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                    <a href="/">Volver al Login</a>
                </Button>
                </div>
                
              </form>
          </CardContent>
        </Card>

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
            <p className="text-xl text-gray-600 mb-8">Recupera el acceso a tu cuenta</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>Si no recibes el correo de recuperación en unos minutos, revisa tu carpeta de spam.</p>
              <p>
                ¿Sigues teniendo problemas? Contáctanos en{" "}
                <a href="mailto:soporte@gasta2.com" className="text-blue-500 hover:underline">
                  soporte@gasta2.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Recovery Form */}
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

          {/* Recovery Card */}
          <Card className="relative bg-white shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Gasta-2</h1>
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Recuperar Contraseña</CardTitle>
              <CardDescription>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </CardDescription>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-lg border-gray-200 bg-gray-50 ps-5"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
                </Button>
              </form>

              <div className="text-center">
                <a
                  href="/"
                  className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 hover:underline text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al Login</span>
                </a>
              </div>

              <div className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <a href="/register" className="text-blue-500 hover:underline">
                  Regístrate aquí
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
