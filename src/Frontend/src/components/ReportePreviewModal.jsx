import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Download, Eye } from 'lucide-react';

const ReportePreviewModal = ({ isOpen, onClose, preview, onConfirmDownload, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Preview del Reporte
            </CardTitle>
            <CardDescription>
              Revisa el contenido antes de generar el archivo Excel
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-96">
          {preview ? (
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md border">
              {preview}
            </pre>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Generando preview...</p>
            </div>
          )}
        </CardContent>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirmDownload} 
            disabled={loading || !preview}
            className="primary-button"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar Excel
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportePreviewModal;