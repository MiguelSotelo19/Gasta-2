import React from 'react';
import { Button } from './ui/button';
import { X, Download, FileText } from 'lucide-react';

const PDFPreviewModal = ({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  onConfirmDownload, 
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Preview Reporte PDF
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando preview del PDF...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <div className="h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border border-gray-300 rounded-lg"
                title="PDF Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se pudo cargar el preview del PDF</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="primary-button"
            onClick={onConfirmDownload}
            disabled={loading || !pdfUrl}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Descargando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;