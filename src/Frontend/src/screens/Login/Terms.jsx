import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { ArrowLeft, DollarSign, Shield, Users, FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Gasta-2</h1>
            </div>
            <Button variant="outline" asChild>
              <a href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Términos de Servicio</CardTitle>
            <p className="text-gray-600">Sistema de Gestión de Gastos Familiares Compartidos</p>
            <p className="text-sm text-gray-500">Universidad Tecnológica Emiliano Zapata UTEZ</p>
            <p className="text-sm text-gray-500">Última actualización: Enero 2025</p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Introducción */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                1. Introducción
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Bienvenido a <strong>Gasta-2</strong>, un sistema web colaborativo desarrollado por la Universidad
                  Tecnológica Emiliano Zapata (UTEZ) para la gestión de gastos familiares
                  compartidos.
                </p>
                <p>
                  Al acceder y utilizar este sistema, usted acepta cumplir con estos términos de servicio. Si no está de
                  acuerdo con alguno de estos términos, no debe utilizar el sistema.
                </p>
              </div>
            </section>

            <Separator />

            {/* Descripción del Servicio */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                2. Descripción del Servicio
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Gasta-2</strong> es un sistema que permite a los usuarios:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Registrar cuentas personales y formar grupos familiares (espacios)</li>
                  <li>Gestionar de forma colaborativa los gastos del hogar</li>
                  <li>Asignar administradores para gestionar gastos y permisos</li>
                  <li>Consultar reportes visuales mensuales</li>
                  <li>Exportar información a PDF o Excel</li>
                  <li>Personalizar categorías de gastos</li>
                  <li>Ajustar porcentajes de pago entre miembros</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Registro y Cuentas */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Registro y Cuentas de Usuario</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>3.1 Elegibilidad:</strong> Para utilizar este sistema, debe ser mayor de edad o contar con
                  autorización de un tutor legal.
                </p>
                <p>
                  <strong>3.2 Información de Registro:</strong> Debe proporcionar información precisa, actual y completa
                  durante el proceso de registro.
                </p>
                <p>
                  <strong>3.3 Seguridad de la Cuenta:</strong> Es responsable de mantener la confidencialidad de su
                  contraseña y de todas las actividades que ocurran bajo su cuenta.
                </p>
                <p>
                  <strong>3.4 Espacios Familiares:</strong> Puede crear o unirse a espacios familiares para gestionar
                  gastos compartidos. Los administradores de cada espacio tienen responsabilidades adicionales de
                  gestión.
                </p>
              </div>
            </section>

            <Separator />

            {/* Uso Aceptable */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Uso Aceptable</h2>
              <div className="space-y-3 text-gray-700">
                <p>Al utilizar Gasta-2, se compromete a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Utilizar el sistema únicamente para fines legítimos de gestión de gastos familiares</li>
                  <li>No compartir información falsa o engañosa sobre gastos</li>
                  <li>Respetar los derechos y privacidad de otros usuarios</li>
                  <li>No intentar acceder a cuentas o espacios sin autorización</li>
                  <li>No utilizar el sistema para actividades comerciales no autorizadas</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Privacidad y Datos */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Privacidad y Protección de Datos</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>5.1 Recopilación de Datos:</strong> Recopilamos información necesaria para el funcionamiento
                  del sistema, incluyendo datos de registro, gastos, y uso del sistema.
                </p>
                <p>
                  <strong>5.2 Uso de Datos:</strong> Los datos se utilizan exclusivamente para proporcionar los
                  servicios del sistema y generar reportes solicitados.
                </p>
                <p>
                  <strong>5.3 Compartir Datos:</strong> Los datos de gastos se comparten únicamente con miembros del
                  mismo espacio familiar según los permisos establecidos.
                </p>
                <p>
                  Para más detalles, consulte nuestra{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </div>
            </section>

            <Separator />

            {/* Responsabilidades */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Responsabilidades y Limitaciones</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>6.1 Disponibilidad:</strong> Nos esforzamos por mantener el sistema disponible, pero no
                  garantizamos un servicio ininterrumpido.
                </p>
                <p>
                  <strong>6.2 Exactitud de Datos:</strong> Los usuarios son responsables de la exactitud de los datos de
                  gastos ingresados al sistema.
                </p>
                <p>
                  <strong>6.3 Decisiones Financieras:</strong> El sistema proporciona herramientas de gestión, pero las
                  decisiones financieras son responsabilidad de los usuarios.
                </p>
                <p>
                  <strong>6.4 Proyecto Académico:</strong> Este sistema es desarrollado con fines académicos por la UTEZ
                  y puede tener limitaciones inherentes a su naturaleza educativa.
                </p>
              </div>
            </section>

            <Separator />

            {/* Propiedad Intelectual */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>7.1 Derechos del Sistema:</strong> Todos los derechos sobre el sistema Gasta-2 pertenecen a la
                  Universidad Tecnológica Emiliano Zapata UTEZ.
                </p>
                <p>
                  <strong>7.2 Datos del Usuario:</strong> Los usuarios mantienen la propiedad de sus datos personales y
                  de gastos ingresados al sistema.
                </p>
              </div>
            </section>

            <Separator />

            {/* Modificaciones */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Modificaciones</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones
                  entrarán en vigor inmediatamente después de su publicación en el sistema.
                </p>
              </div>
            </section>

            <Separator />

            {/* Contacto */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contacto</h2>
              <div className="space-y-3 text-gray-700">
                <p>Para preguntas sobre estos términos, puede contactarnos:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <strong>Universidad Tecnológica Emiliano Zapata UTEZ</strong>
                  </p>
                  <p>Proyecto: Sistema Gasta-2</p>
                  <p>Email: 20223tn113@utez.edu.mx</p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 border-t">
              <p className="text-sm text-gray-500">
                © 2025 Universidad Tecnológica Emiliano Zapata UTEZ
              </p>
              <p className="text-sm text-gray-500">Todos los derechos reservados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
