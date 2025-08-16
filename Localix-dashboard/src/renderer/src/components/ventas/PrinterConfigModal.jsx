import React, { useState, useEffect } from 'react';
import { Printer, Settings, Check, X } from 'lucide-react';

const PrinterConfigModal = ({ isOpen, onClose }) => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [loading, setLoading] = useState(false);
  const [defaultPrinter, setDefaultPrinter] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPrinters();
    }
  }, [isOpen]);

  const loadPrinters = async () => {
    setLoading(true);
    try {
      // Obtener impresora por defecto
      if (window.pdfAPI) {
        const defaultResult = await window.pdfAPI.obtenerImpresoraPorDefecto();
        if (defaultResult.success) {
          setDefaultPrinter(defaultResult.printer);
        }

        // Obtener lista de impresoras
        const printersResult = await window.pdfAPI.listarImpresoras();
        if (printersResult.success) {
          setPrinters(printersResult.printers || []);
        }
      }
    } catch (error) {
      console.error('Error cargando impresoras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    // Guardar configuración en localStorage
    localStorage.setItem('selectedPrinter', selectedPrinter);
    onClose();
  };

  const handleTestPrint = async () => {
    if (!selectedPrinter) {
      alert('Selecciona una impresora primero');
      return;
    }

    try {
      // Crear un PDF de prueba
      const testVenta = {
        id: 'TEST',
        numero_venta: 'TEST-001',
        fecha_venta: new Date().toISOString(),
        cliente: { nombre: 'Cliente de Prueba' },
        items: [
          {
            producto: { nombre: 'Producto de Prueba' },
            cantidad: 1,
            precio_unitario: 10.00,
            subtotal: 10.00
          }
        ],
        total: 10.00,
        metodo_pago: 'efectivo',
        vendedor: 'Sistema'
      };

      // Generar PDF de prueba
      const { generarReciboSimple } = await import('../../utils/ventaPDFGenerator');
      const doc = await generarReciboSimple(testVenta);
      
      // Imprimir
      if (window.pdfAPI) {
        const pdfBlob = doc.output('blob');
        await window.pdfAPI.imprimir(pdfBlob, 'test_print.pdf');
        alert('Página de prueba enviada a la impresora');
      }
    } catch (error) {
      console.error('Error en impresión de prueba:', error);
      alert('Error al imprimir página de prueba');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Printer className="w-5 h-5 mr-2" />
            Configuración de Impresora
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando impresoras...</p>
          </div>
        ) : (
          <>
            {/* Impresora por defecto del sistema */}
            {defaultPrinter && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Impresora por defecto del sistema:
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {defaultPrinter.name || 'No disponible'}
                </p>
              </div>
            )}

            {/* Lista de impresoras disponibles */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar impresora para recibos:
              </label>
              <select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Usar impresora por defecto</option>
                {printers.map((printer, index) => (
                  <option key={index} value={printer.name}>
                    {printer.name} {printer.isDefault ? '(Por defecto)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Información adicional */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Información:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Los recibos se imprimen automáticamente al completar una venta</li>
                <li>• Si no seleccionas una impresora, se usará la del sistema</li>
                <li>• Puedes probar la configuración con el botón de abajo</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                onClick={handleTestPrint}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Probar Impresión
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrinterConfigModal;
