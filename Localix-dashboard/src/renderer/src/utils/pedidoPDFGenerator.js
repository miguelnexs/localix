import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getLogoBase64, createSimpleLogo } from './logoConfig.js';
import { getCompanyData } from './companyConfig.js';

// Función para cargar la imagen de fondo
const loadBackgroundImage = async () => {
  try {
    console.log('🔍 Intentando cargar imagen de fondo...');
    
    // Primero intentar usar la API de Electron si está disponible
    if (window.electronAPI && window.electronAPI.loadImageAsBase64) {
      console.log('📡 Usando API de Electron para cargar imagen de fondo...');
      const base64 = await window.electronAPI.loadImageAsBase64('logo_Mesa de trabajo 1.png');
      if (base64) {
        console.log('✅ Imagen de fondo cargada exitosamente desde Electron API');
        return base64;
      } else {
        console.log('❌ Electron API no pudo cargar la imagen de fondo');
      }
    } else {
      console.log('⚠️ Electron API no disponible');
    }
    
    // Fallback: intentar cargar usando fetch
    console.log('🌐 Intentando cargar imagen de fondo con fetch...');
    const response = await fetch('/img/logo_Mesa de trabajo 1.png');
    if (response.ok) {
      console.log('✅ Imagen de fondo cargada exitosamente con fetch');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } else {
      console.log('❌ Fetch no pudo cargar la imagen de fondo:', response.status);
    }
    
    return null;
  } catch (error) {
    console.warn('❌ Error al cargar la imagen de fondo:', error);
    return null;
  }
};

// Función para cargar la imagen real del logo
const loadRealLogo = async () => {
  try {
    console.log('🔍 Intentando cargar imagen real del logo...');
    
    // Primero intentar usar la API de Electron si está disponible
    if (window.electronAPI && window.electronAPI.loadImageAsBase64) {
      console.log('📡 Usando API de Electron para cargar imagen...');
      const base64 = await window.electronAPI.loadImageAsBase64('Logo.png');
      if (base64) {
        console.log('✅ Imagen cargada exitosamente desde Electron API');
        return base64;
      } else {
        console.log('❌ Electron API no pudo cargar la imagen');
      }
    } else {
      console.log('⚠️ Electron API no disponible');
    }
    
    // Fallback: intentar cargar usando fetch
    console.log('🌐 Intentando cargar con fetch...');
    const response = await fetch('/img/Logo.png');
    if (response.ok) {
      console.log('✅ Imagen cargada exitosamente con fetch');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } else {
      console.log('❌ Fetch no pudo cargar la imagen:', response.status);
    }
    
    return null;
  } catch (error) {
    console.warn('❌ Error al cargar la imagen real del logo:', error);
    return null;
  }
};

// Función principal para obtener el logo
const getLogo = async () => {
  try {
    console.log('🔍 Intentando cargar logo...');
    
    // Primero intentar obtener el logo desde la configuración
    const configLogo = getLogoBase64();
    if (configLogo) {
      console.log('✅ Logo cargado desde configuración');
      return configLogo;
    }
    
    // Si no hay logo en configuración, intentar cargar la imagen real
    const realLogo = await loadRealLogo();
    if (realLogo) {
      console.log('✅ Logo cargado desde archivo');
      return realLogo;
    }
    
    // Como último recurso, usar el logo generado
    console.log('🔄 Usando logo generado como fallback');
    return createSimpleLogo();
  } catch (error) {
    console.warn('❌ Error al cargar logo, usando fallback:', error);
    return createSimpleLogo();
  }
};

// Función para obtener la configuración de la tienda
const getTiendaConfig = () => {
  return getCompanyData();
};

// Función para obtener el texto del estado
const getEstadoText = (estado) => {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente';
    case 'confirmado':
      return 'Confirmado';
    case 'en_preparacion':
      return 'En Preparación';
    case 'enviado':
      return 'Enviado';
    case 'entregado':
      return 'Entregado';
    case 'cancelado':
      return 'Cancelado';
    default:
      return estado;
  }
};

// Función para obtener el color del estado
const getEstadoColor = (estado) => {
  switch (estado) {
    case 'pendiente':
      return '#fef3c7';
    case 'confirmado':
      return '#dbeafe';
    case 'en_preparacion':
      return '#fed7aa';
    case 'enviado':
      return '#e9d5ff';
    case 'entregado':
      return '#dbeafe';
    case 'cancelado':
      return '#fecaca';
    default:
      return '#f3f4f6';
  }
};

// Función para crear el HTML del reporte de pedido
const createPedidoHTML = (pedido, logoImage, backgroundImage) => {
  const fecha = new Date(pedido.fecha_creacion).toLocaleString('es-ES');
  const clienteNombre = pedido.cliente?.nombre || pedido.venta?.cliente_nombre || 'Cliente General';
  const clienteTelefono = pedido.cliente?.telefono || pedido.telefono_contacto || '';
  const clienteEmail = pedido.cliente?.email || '';
  
  // Obtener configuración de la tienda
  const TIENDA_CONFIG = getTiendaConfig();
  
  // Calcular subtotal
  const subtotal = pedido.items?.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0) || 0;
  
  // Generar filas de productos
  const productosHTML = pedido.items?.map(item => {
    const nombre = item.producto?.nombre || item.producto_nombre || 'Producto';
    const color = item.color?.nombre || '';
    const cantidad = item.cantidad || 0;
    const precio = parseFloat(item.precio_unitario || 0);
    const total = parseFloat(item.subtotal || 0);
    const nombreCompleto = color ? `${nombre} (${color})` : nombre;
    
    return `
      <tr>
        <td class="producto-nombre">${nombreCompleto}</td>
        <td class="cantidad">${cantidad}</td>
        <td class="precio">$${precio.toFixed(2)}</td>
        <td class="total">$${total.toFixed(2)}</td>
      </tr>
    `;
  }).join('') || '';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Pedido</title>
        <style>
            @page {
                size: A4;
                margin: 0;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
                position: relative;
                min-height: 100vh;
            }
            
            /* Imagen de fondo con transparencia */
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('${backgroundImage || ''}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                opacity: 0.3;
                z-index: -1;
            }
            
            .container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
                background: rgba(255, 255, 255, 0.95);
                min-height: 100vh;
            }
            
            /* Header */
            .header {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                color: #333;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 20px;
                border: 2px solid #dee2e6;
            }
            
            .logo {
                width: 60px;
                height: 60px;
                object-fit: contain;
                border-radius: 8px;
                background: white;
                padding: 5px;
            }
            
            .tienda-info h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }
            
            .tienda-info p {
                font-size: 12px;
                margin: 2px 0;
                color: #333;
            }
            
            /* Información del pedido */
            .pedido-info {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .pedido-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #dee2e6;
            }
            
            .pedido-numero {
                font-size: 20px;
                font-weight: bold;
                color: #333;
            }
            
            .pedido-fecha {
                font-size: 14px;
                color: #666;
            }
            
            .cliente-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .cliente-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .cliente-label {
                font-weight: bold;
                color: #333;
                min-width: 80px;
            }
            
            .cliente-valor {
                color: #333;
            }
            
            /* Estado del pedido */
            .estado-section {
                background: ${getEstadoColor(pedido.estado_pedido)};
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                border: 2px solid #dee2e6;
            }
            
            .estado-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .estado-label {
                font-weight: bold;
                color: #333;
            }
            
            .estado-valor {
                color: #333;
                font-weight: 500;
                text-transform: uppercase;
            }
            
            /* Tabla de productos */
            .productos-section {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .productos-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .productos-table th {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                color: #333;
                padding: 15px 10px;
                text-align: left;
                font-weight: bold;
                font-size: 14px;
            }
            
            .productos-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #f0f0f0;
                font-size: 13px;
            }
            
            .productos-table tr:nth-child(even) {
                background-color: #fafafa;
            }
            
            .productos-table tr:hover {
                background-color: #f5f5f5;
            }
            
            .producto-nombre {
                font-weight: 500;
                color: #333;
            }
            
            .cantidad {
                text-align: center;
                font-weight: bold;
                color: #333;
            }
            
            .precio, .total {
                text-align: right;
                font-weight: bold;
            }
            
            .precio {
                color: #666;
            }
            
            .total {
                color: #333;
            }
            
            /* Totales */
            .totales-section {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid #dee2e6;
            }
            
            .totales-grid {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 10px;
                align-items: center;
            }
            
            .total-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 0;
            }
            
            .total-label {
                font-weight: bold;
                color: #333;
                font-size: 14px;
            }
            
            .total-valor {
                font-weight: bold;
                color: #333;
                font-size: 14px;
            }
            
            .total-final {
                border-top: 2px solid #333;
                padding-top: 10px;
                margin-top: 10px;
            }
            
            .total-final .total-label {
                font-size: 18px;
            }
            
            .total-final .total-valor {
                font-size: 18px;
                color: #333;
            }
            
            /* Información adicional */
            .adicional-section {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .adicional-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .adicional-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .adicional-label {
                font-weight: bold;
                color: #333;
                min-width: 120px;
            }
            
            .adicional-valor {
                color: #333;
            }
            
            /* Fechas importantes */
            .fechas-section {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .fechas-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            
            .fecha-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .fecha-label {
                font-weight: bold;
                color: #333;
                min-width: 100px;
            }
            
            .fecha-valor {
                color: #333;
            }
            
            /* Footer */
            .footer {
                text-align: center;
                padding: 20px;
                border-top: 3px solid #dee2e6;
                margin-top: 20px;
            }
            
            .footer h3 {
                color: #333;
                font-size: 16px;
                margin-bottom: 10px;
            }
            
            .footer p {
                color: #666;
                font-size: 12px;
                margin: 3px 0;
            }
            
            /* Responsive */
            @media print {
                body {
                    background: white;
                }
                
                .container {
                    max-width: none;
                    padding: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                ${logoImage ? `<img src="${logoImage}" alt="Logo" class="logo">` : ''}
                <div class="tienda-info">
                    <h1>${TIENDA_CONFIG.nombre}</h1>
                    <p>${TIENDA_CONFIG.direccion}</p>
                    <p>${TIENDA_CONFIG.telefono} | ${TIENDA_CONFIG.ruc}</p>
                    <p>${TIENDA_CONFIG.email}</p>
                </div>
            </div>
            
            <!-- Información del pedido -->
            <div class="pedido-info">
                <div class="pedido-header">
                    <div class="pedido-numero">PEDIDO #${pedido.numero_pedido || pedido.id}</div>
                    <div class="pedido-fecha">${fecha}</div>
                </div>
                
                <div class="cliente-info">
                    <div class="cliente-item">
                        <span class="cliente-label">Cliente:</span>
                        <span class="cliente-valor">${clienteNombre}</span>
                    </div>
                    ${clienteTelefono ? `
                    <div class="cliente-item">
                        <span class="cliente-label">Teléfono:</span>
                        <span class="cliente-valor">${clienteTelefono}</span>
                    </div>
                    ` : ''}
                    ${clienteEmail ? `
                    <div class="cliente-item">
                        <span class="cliente-label">Email:</span>
                        <span class="cliente-valor">${clienteEmail}</span>
                    </div>
                    ` : ''}
                    <div class="cliente-item">
                        <span class="cliente-label">Tipo:</span>
                        <span class="cliente-valor">${pedido.tipo_venta === 'fisica' ? 'Venta Física' : 'Venta Digital'}</span>
                    </div>
                </div>
                
                <!-- Estado del pedido -->
                <div class="estado-section">
                    <div class="estado-info">
                        <span class="estado-label">Estado del Pedido:</span>
                        <span class="estado-valor">${getEstadoText(pedido.estado_pedido)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Tabla de productos -->
            <div class="productos-section">
                <table class="productos-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosHTML}
                    </tbody>
                </table>
            </div>
            
            <!-- Totales -->
            <div class="totales-section">
                <div class="totales-grid">
                    <div class="total-item">
                        <span class="total-label">Subtotal:</span>
                        <span class="total-valor">$${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div class="total-item total-final">
                        <span class="total-label">TOTAL:</span>
                        <span class="total-valor">$${parseFloat(pedido.total_pedido || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Información adicional -->
            <div class="adicional-section">
                <div class="adicional-grid">
                    <div class="adicional-item">
                        <span class="adicional-label">Estado de Pago:</span>
                        <span class="adicional-valor">${pedido.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}</span>
                    </div>
                    <div class="adicional-item">
                        <span class="adicional-label">Método de Pago:</span>
                        <span class="adicional-valor">${pedido.metodo_pago || 'No especificado'}</span>
                    </div>
                    ${pedido.codigo_seguimiento ? `
                    <div class="adicional-item">
                        <span class="adicional-label">Código Seguimiento:</span>
                        <span class="adicional-valor">${pedido.codigo_seguimiento}</span>
                    </div>
                    ` : ''}
                    ${pedido.empresa_envio ? `
                    <div class="adicional-item">
                        <span class="adicional-label">Empresa de Envío:</span>
                        <span class="adicional-valor">${pedido.empresa_envio}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Fechas importantes -->
            <div class="fechas-section">
                <div class="fechas-grid">
                    <div class="fecha-item">
                        <span class="fecha-label">Creación:</span>
                        <span class="fecha-valor">${new Date(pedido.fecha_creacion).toLocaleDateString('es-ES')}</span>
                    </div>
                    ${pedido.fecha_confirmacion ? `
                    <div class="fecha-item">
                        <span class="fecha-label">Confirmación:</span>
                        <span class="fecha-valor">${new Date(pedido.fecha_confirmacion).toLocaleDateString('es-ES')}</span>
                    </div>
                    ` : ''}
                    ${pedido.fecha_envio ? `
                    <div class="fecha-item">
                        <span class="fecha-label">Envío:</span>
                        <span class="fecha-valor">${new Date(pedido.fecha_envio).toLocaleDateString('es-ES')}</span>
                    </div>
                    ` : ''}
                    ${pedido.fecha_entrega ? `
                    <div class="fecha-item">
                        <span class="fecha-label">Entrega:</span>
                        <span class="fecha-valor">${new Date(pedido.fecha_entrega).toLocaleDateString('es-ES')}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${pedido.instrucciones_entrega ? `
            <!-- Instrucciones de entrega -->
            <div class="adicional-section">
                <div class="adicional-item">
                    <span class="adicional-label">Instrucciones de Entrega:</span>
                    <span class="adicional-valor">${pedido.instrucciones_entrega}</span>
                </div>
            </div>
            ` : ''}
            
            ${pedido.notas ? `
            <!-- Notas -->
            <div class="adicional-section">
                <div class="adicional-item">
                    <span class="adicional-label">Notas:</span>
                    <span class="adicional-valor">${pedido.notas}</span>
                </div>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
                <h3>Reporte de Pedido</h3>
                <p>Para consultas: ${TIENDA_CONFIG.telefono}</p>
                <p>${TIENDA_CONFIG.web}</p>
                <p>Generado el: ${new Date().toLocaleString('es-ES')}</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Función para generar PDF desde HTML
const generatePDFFromHTML = async (htmlContent, fileName, format = 'a4') => {
  try {
    console.log('🔄 Generando PDF desde HTML...');
    
    // Crear un elemento temporal para el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm'; // Ancho A4
    tempDiv.style.height = 'auto';
    tempDiv.style.background = 'white';
    document.body.appendChild(tempDiv);
    
    // Convertir HTML a canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Mejor calidad
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // 210mm en píxeles a 96 DPI
      height: tempDiv.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });
    
    // Remover el elemento temporal
    document.body.removeChild(tempDiv);
    
    // Crear PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: format
    });
    
    const imgWidth = 210; // Ancho A4 en mm
    const pageHeight = 297; // Alto A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Agregar primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Agregar páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Guardar PDF
    pdf.save(fileName);
    
    console.log('✅ PDF generado exitosamente');
    return pdf;
    
  } catch (error) {
    console.error('❌ Error al generar PDF desde HTML:', error);
    throw error;
  }
};

/**
 * Genera un PDF de reporte para un pedido usando HTML
 * @param {Object} pedido - Datos del pedido
 * @param {boolean} autoPrint - Si debe imprimir automáticamente
 */
export const generarReportePedido = async (pedido, autoPrint = true) => {
  try {
    console.log('🚀 Iniciando generación de reporte de pedido con HTML...');
    
    // Cargar imágenes
    const logoImage = await getLogo();
    const backgroundImage = await loadBackgroundImage();
    
    // Crear HTML del reporte
    const htmlContent = createPedidoHTML(pedido, logoImage, backgroundImage);
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).replace(':', '-');
    const fileName = `reporte_pedido_${pedido.numero_pedido || pedido.id}_${fecha}_${hora}.pdf`;
    
    // Generar PDF
    const pdf = await generatePDFFromHTML(htmlContent, fileName, 'a4');
    
    // Imprimir si se solicita
    if (autoPrint) {
      if (window.electronAPI && window.electronAPI.printPDF) {
        const pdfBlob = pdf.output('blob');
        window.electronAPI.printPDF(pdfBlob, fileName);
      } else {
        // Fallback: abrir en nueva ventana
        setTimeout(() => {
          window.open(pdf.output('bloburl'), '_blank');
        }, 100);
      }
    }
    
    return pdf;
    
  } catch (error) {
    console.error('❌ Error al generar reporte de pedido:', error);
    throw error;
  }
};

/**
 * Genera un reporte simple de pedido usando HTML
 * @param {Object} pedido - Datos del pedido
 */
export const generarReporteSimple = async (pedido) => {
  try {
    console.log('🚀 Iniciando generación de reporte simple de pedido con HTML...');
    
    // Cargar imágenes
    const logoImage = await getLogo();
    const backgroundImage = await loadBackgroundImage();
    
    // Crear HTML del reporte (mismo que el anterior)
    const htmlContent = createPedidoHTML(pedido, logoImage, backgroundImage);
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `reporte_simple_pedido_${pedido.numero_pedido || pedido.id}_${fecha}.pdf`;
    
    // Generar PDF
    const pdf = await generatePDFFromHTML(htmlContent, fileName, 'a4');
    
    return pdf;
    
  } catch (error) {
    console.error('❌ Error al generar reporte simple de pedido:', error);
    throw error;
  }
};

/**
 * Función de prueba para generar un PDF de pedido de ejemplo
 */
export const testPedidoPDFGeneration = async () => {
  console.log('🧪 Iniciando prueba de generación de PDF de pedido...');
  
  try {
    // Datos de prueba
    const pedidoPrueba = {
      id: 'PED001',
      numero_pedido: 'P-2024-001',
      fecha_creacion: new Date().toISOString(),
      estado_pedido: 'en_preparacion',
      estado_pago: 'pagado',
      tipo_venta: 'fisica',
      metodo_pago: 'Efectivo',
      total_pedido: 125.50,
      cliente: {
        nombre: 'Cliente de Prueba',
        telefono: '3001234567',
        email: 'cliente@prueba.com'
      },
      items: [
        {
          producto: { nombre: 'Producto 1' },
          color: { nombre: 'Rojo' },
          cantidad: 2,
          precio_unitario: 25.50,
          subtotal: 51.00
        },
        {
          producto: { nombre: 'Producto 2' },
          cantidad: 1,
          precio_unitario: 15.75,
          subtotal: 15.75
        }
      ],
      instrucciones_entrega: 'Entregar en horario de oficina',
      notas: 'Este es un pedido de prueba para verificar la generación de PDFs.',
      codigo_seguimiento: 'TRK123456789',
      empresa_envio: 'Servientrega'
    };
    
    const pdf = await generarReportePedido(pedidoPrueba, false);
    console.log('✅ PDF de pedido de prueba generado exitosamente');
    return pdf;
    
  } catch (error) {
    console.error('❌ Error en la prueba de generación de PDF de pedido:', error);
    throw error;
  }
}; 