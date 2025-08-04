import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ReporteValidationAlert = ({ validacion }) => {
  if (validacion.esValido) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ✅ Los datos están listos para generar el reporte
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-red-50 border-red-200">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div>
          <p className="font-semibold mb-2">❌ Se encontraron los siguientes problemas:</p>
          <ul className="list-disc list-inside space-y-1">
            {validacion.errores.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ReporteValidationAlert;