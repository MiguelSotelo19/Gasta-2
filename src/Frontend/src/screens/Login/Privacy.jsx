import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { ArrowLeft, DollarSign, Shield, Lock, Eye, Database, UserCheck } from "lucide-react"

export default function PrivacyPage() {
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Política de Privacidad</CardTitle>
            <p className="text-gray-600">Sistema de Gestión de Gastos Familiares Compartidos</p>
            <p className="text-sm text-gray-500">Universidad Tecnológica Emiliano Zapata UTEZ</p>
            <p className="text-sm text-gray-500">Última actualización: Julio 2025</p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Introducción */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-600" />
                1. Introducción
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  En la Universidad Tecnológica Emiliano Zapata (UTEZ), valoramos y respetamos su
                  privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y
                  protegemos su información personal en el sistema <strong>Gasta-2</strong>.
                </p>
                <p>
                  Al utilizar nuestro sistema, usted acepta las prácticas descritas en esta política. Si no está de
                  acuerdo con estas prácticas, no utilice el sistema.
                </p>
              </div>
            </section>

            <Separator />

            {/* Información que Recopilamos */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                2. Información que Recopilamos
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2.1 Información de Registro</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Correo electrónico</li>
                    <li>Nombre de usuario</li>
                    <li>Contraseña (encriptada)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2.2 Información de Gastos</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Descripción de gastos</li>
                    <li>Montos y fechas</li>
                    <li>Categorías de gastos</li>
                    <li>Porcentajes de distribución</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2.3 Información de Espacios Familiares</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nombre del espacio familiar</li>
                    <li>Miembros del grupo</li>
                    <li>Roles y permisos</li>
                    <li>Configuraciones de grupo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2.4 Información Técnica</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Dirección IP</li>
                    <li>Tipo de navegador</li>
                    <li>Fecha y hora de acceso</li>
                    <li>Páginas visitadas</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Cómo Utilizamos la Información */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                3. Cómo Utilizamos su Información
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Utilizamos la información recopilada para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Funcionamiento del Sistema:</strong> Proporcionar las funcionalidades de gestión de gastos
                    compartidos
                  </li>
                  <li>
                    <strong>Generación de Reportes:</strong> Crear reportes visuales mensuales y exportaciones a
                    PDF/Excel
                  </li>
                  <li>
                    <strong>Gestión de Espacios:</strong> Facilitar la colaboración entre miembros de espacios
                    familiares
                  </li>
                  <li>
                    <strong>Seguridad:</strong> Proteger el sistema contra uso no autorizado y fraude
                  </li>
                  <li>
                    <strong>Mejoras del Sistema:</strong> Analizar el uso para mejorar funcionalidades (datos
                    anonimizados)
                  </li>
                  <li>
                    <strong>Comunicación:</strong> Enviar notificaciones importantes sobre el sistema
                  </li>
                  <li>
                    <strong>Fines Académicos:</strong> Investigación y desarrollo educativo (datos anonimizados)
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Compartir Información */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Compartir su Información</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4.1 Dentro de Espacios Familiares</h3>
                  <p>
                    Los datos de gastos se comparten automáticamente con otros miembros del mismo espacio familiar,
                    según los permisos establecidos por los administradores.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4.2 No Compartimos con Terceros</h3>
                  <p>
                    No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las
                    siguientes circunstancias:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Cuando sea requerido por ley</li>
                    <li>Para proteger nuestros derechos legales</li>
                    <li>En caso de emergencia para proteger la seguridad personal</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4.3 Fines Académicos</h3>
                  <p>
                    Los datos pueden ser utilizados de forma anonimizada para investigación y desarrollo académico
                    dentro de la UTEZ.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Seguridad */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-600" />
                5. Seguridad de la Información
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Encriptación:</strong> Las contraseñas se almacenan encriptadas y las comunicaciones se
                    realizan a través de conexiones seguras
                  </li>
                  <li>
                    <strong>Control de Acceso:</strong> Solo personal autorizado tiene acceso a los datos del sistema
                  </li>
                  <li>
                    <strong>Monitoreo:</strong> Supervisamos el sistema para detectar actividades sospechosas
                  </li>
                  <li>
                    <strong>Actualizaciones:</strong> Mantenemos el sistema actualizado con los últimos parches de
                    seguridad
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Derechos del Usuario */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Sus Derechos</h2>
              <div className="space-y-3 text-gray-700">
                <p>Como usuario, tiene los siguientes derechos:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Acceso:</strong> Solicitar información sobre los datos personales que tenemos sobre usted
                  </li>
                  <li>
                    <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
                  </li>
                  <li>
                    <strong>Eliminación:</strong> Solicitar la eliminación de su cuenta y datos asociados
                  </li>
                  <li>
                    <strong>Portabilidad:</strong> Exportar sus datos en formatos estándar (PDF, Excel)
                  </li>
                  <li>
                    <strong>Restricción:</strong> Limitar el procesamiento de sus datos en ciertas circunstancias
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Retención de Datos */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Retención de Datos</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>7.1 Datos de Usuario:</strong> Mantenemos sus datos mientras su cuenta esté activa o según sea
                  necesario para proporcionar los servicios.
                </p>
                <p>
                  <strong>7.2 Datos de Gastos:</strong> Los registros de gastos se conservan según las necesidades del
                  espacio familiar y pueden ser eliminados por los administradores.
                </p>
                <p>
                  <strong>7.3 Eliminación:</strong> Cuando elimine su cuenta, sus datos personales serán eliminados
                  de manera instantánea.
                </p>
              </div>
            </section>

            <Separator />

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies y Tecnologías Similares</h2>
              <div className="space-y-3 text-gray-700">
                <p>Utilizamos cookies y tecnologías similares para:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Mantener su sesión activa</li>
                  <li>Recordar sus preferencias</li>
                  <li>Mejorar la seguridad del sistema</li>
                  <li>Analizar el uso del sistema (cookies analíticas)</li>
                </ul>
                <p>Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad.</p>
              </div>
            </section>

            <Separator />

            {/* Cambios en la Política */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Cambios en esta Política</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Podemos actualizar esta Política de Privacidad ocasionalmente. La fecha de la última actualización se
                  muestra al inicio de esta política.
                </p>
              </div>
            </section>

            <Separator />

            {/* Contacto */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contacto</h2>
              <div className="space-y-3 text-gray-700">
                <p>Para preguntas sobre esta Política de Privacidad o para ejercer sus derechos, puede contactarnos:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <strong>Universidad Tecnológica Emiliano Zapata UTEZ</strong>
                  </p>
                  <p>Proyecto: Sistema Gasta-2</p>
                  <p>Email: 20223tn113@utez.edu.mx</p>
                  <p>Responsable de Protección de Datos: Coordinación de Sistemas</p>
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
