import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getLogoBase64, createSimpleLogo } from './logoConfig.js';

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

// Configuración de la tienda
const TIENDA_CONFIG = {
  nombre: 'Carolina González Sarta',
  direccion: 'Cra 7 # 15 57 local 101',
  telefono: '3147435305',
  email: 'carolina.gonzalez@localix.com',
  ruc: '1088297299-0',
  web: 'www.carolinagonzalez.com'
};

// Función para obtener el texto del estado del pedido
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
      return estado || 'Pendiente';
  }
};

// Función para obtener el color del estado
const getEstadoColor = (estado) => {
  switch (estado) {
    case 'pendiente':
      return '#fbbf24'; // Amarillo
    case 'confirmado':
      return '#3b82f6'; // Azul
    case 'en_preparacion':
      return '#f97316'; // Naranja
    case 'enviado':
      return '#8b5cf6'; // Púrpura
    case 'entregado':
      return '#10b981'; // Verde
    case 'cancelado':
      return '#ef4444'; // Rojo
    default:
      return '#6b7280'; // Gris
  }
};

// Función para crear el HTML del pedido
const createPedidoHTML = (pedido, logoImage, backgroundImage) => {
  const fecha = pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleString('es-ES') : new Date().toLocaleString('es-ES');
  const clienteNombre = pedido.cliente?.nombre || pedido.cliente_nombre || 'Cliente General';
  const clienteTelefono = pedido.cliente?.telefono || pedido.telefono_contacto || '';
  const clienteEmail = pedido.cliente?.email || '';
  const clienteDireccion = pedido.cliente?.direccion || pedido.direccion_entrega || '';
  
  // Calcular subtotal
  const subtotal = pedido.items?.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0) || 0;
  
  // Generar filas de productos
  const productosHTML = pedido.items?.map(item => {
    const nombre = (item.producto && item.producto.nombre) || item.producto_nombre || 'Producto';
    const sku = (item.producto && item.producto.sku) || item.sku || '';
    
    // Obtener nombre del color
    let colorNombre = '';
    if (item.color) {
      if (typeof item.color === 'object' && item.color.nombre) {
        colorNombre = item.color.nombre;
      } else if (typeof item.color === 'string') {
        colorNombre = item.color;
      }
    } else if (item.producto) {
      if (item.producto.variante && (item.producto.variante.color_nombre || item.producto.variante.color)) {
        colorNombre = item.producto.variante.color_nombre || item.producto.variante.color;
      } else if (item.producto.color_nombre || item.producto.color) {
        colorNombre = item.producto.color_nombre || item.producto.color;
      }
    } else if (item.variante && (item.variante.color_nombre || item.variante.color)) {
      colorNombre = item.variante.color_nombre || item.variante.color;
    } else if (item.color_nombre || item.color) {
      colorNombre = item.color_nombre || item.color;
    }
    
    const cantidad = item.cantidad || 0;
    const precio = parseFloat(item.precio_unitario || 0);
    const total = parseFloat(item.subtotal || 0);
    
    return `
      <tr>
        <td class="producto-nombre">${nombre}</td>
        <td class="sku">${sku}</td>
        <td class="color">${colorNombre}</td>
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
        <title>Pedido</title>
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
            
            .estado-badge {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                color: white;
                font-weight: bold;
                font-size: 12px;
                background-color: ${getEstadoColor(pedido.estado_pedido)};
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
            
            /* Información de entrega */
            ${pedido.direccion_entrega || pedido.telefono_contacto || pedido.instrucciones_entrega ? `
            .entrega-info {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .entrega-info h3 {
                color: #333;
                font-size: 16px;
                margin-bottom: 10px;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 5px;
            }
            
            .entrega-item {
                margin-bottom: 8px;
            }
            
            .entrega-label {
                font-weight: bold;
                color: #333;
                margin-right: 10px;
            }
            
            .entrega-valor {
                color: #333;
            }
            ` : ''}
            
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
                padding: 15px 8px;
                text-align: left;
                font-weight: bold;
                font-size: 12px;
            }
            
            .productos-table td {
                padding: 12px 8px;
                border-bottom: 1px solid #f0f0f0;
                font-size: 11px;
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
                max-width: 120px;
                word-wrap: break-word;
            }
            
            .sku {
                color: #666;
                font-family: monospace;
                font-size: 10px;
            }
            
            .color {
                color: #333;
                font-weight: 500;
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
            .info-adicional {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .info-adicional h3 {
                color: #333;
                font-size: 16px;
                margin-bottom: 10px;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 5px;
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .info-label {
                font-weight: bold;
                color: #333;
            }
            
            .info-valor {
                color: #333;
            }
            
            /* Observaciones */
            ${pedido.notas ? `
            .observaciones-section {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .observaciones-label {
                font-weight: bold;
                color: #333;
                margin-bottom: 8px;
            }
            
            .observaciones-texto {
                color: #333;
                font-style: italic;
                line-height: 1.5;
            }
            ` : ''}
            
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
                    <div>
                        <div class="pedido-numero">PEDIDO #${pedido.numero_pedido || ''}</div>
                        <div class="pedido-fecha">${fecha}</div>
                    </div>
                    <div class="estado-badge">${getEstadoText(pedido.estado_pedido)}</div>
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
                    ${clienteDireccion ? `
                    <div class="cliente-item">
                        <span class="cliente-label">Dirección:</span>
                        <span class="cliente-valor">${clienteDireccion}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${pedido.direccion_entrega || pedido.telefono_contacto || pedido.instrucciones_entrega ? `
            <!-- Información de entrega -->
            <div class="entrega-info">
                <h3>Información de Entrega</h3>
                ${pedido.direccion_entrega ? `
                <div class="entrega-item">
                    <span class="entrega-label">Dirección:</span>
                    <span class="entrega-valor">${pedido.direccion_entrega}</span>
                </div>
                ` : ''}
                ${pedido.telefono_contacto ? `
                <div class="entrega-item">
                    <span class="entrega-label">Teléfono:</span>
                    <span class="entrega-valor">${pedido.telefono_contacto}</span>
                </div>
                ` : ''}
                ${pedido.instrucciones_entrega ? `
                <div class="entrega-item">
                    <span class="entrega-label">Instrucciones:</span>
                    <span class="entrega-valor">${pedido.instrucciones_entrega}</span>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <!-- Tabla de productos -->
            <div class="productos-section">
                <table class="productos-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>SKU</th>
                            <th>Color</th>
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
                        <span class="total-valor">$${pedido.total?.toFixed(2) || subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Información adicional -->
            <div class="info-adicional">
                <h3>Información Adicional</h3>
                <div class="info-item">
                    <span class="info-label">Tipo de Venta:</span>
                    <span class="info-valor">${pedido.tipo_venta === 'fisica' ? 'Venta Física' : 'Venta Digital'}</span>
                </div>
                ${pedido.metodo_pago ? `
                <div class="info-item">
                    <span class="info-label">Método de Pago:</span>
                    <span class="info-valor">${pedido.metodo_pago}</span>
                </div>
                ` : ''}
                ${pedido.estado_pago ? `
                <div class="info-item">
                    <span class="info-label">Estado de Pago:</span>
                    <span class="info-valor">${pedido.estado_pago}</span>
                </div>
                ` : ''}
                ${pedido.codigo_seguimiento ? `
                <div class="info-item">
                    <span class="info-label">Código de Seguimiento:</span>
                    <span class="info-valor">${pedido.codigo_seguimiento}</span>
                </div>
                ` : ''}
                ${pedido.empresa_envio ? `
                <div class="info-item">
                    <span class="info-label">Empresa de Envío:</span>
                    <span class="info-valor">${pedido.empresa_envio}</span>
                </div>
                ` : ''}
            </div>
            
            ${pedido.notas ? `
            <!-- Observaciones -->
            <div class="observaciones-section">
                <div class="observaciones-label">Observaciones:</div>
                <div class="observaciones-texto">${pedido.notas}</div>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
                <h3>¡Gracias por tu pedido!</h3>
                <p>Para consultas sobre el estado de tu pedido: ${TIENDA_CONFIG.telefono}</p>
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
    tempDiv.style.width = '210mm';
    tempDiv.style.height = 'auto';
    tempDiv.style.background = 'white';
    document.body.appendChild(tempDiv);
    
    // Convertir HTML a canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
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
    
    const imgWidth = 210;
    const pageHeight = 297;
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
 * Genera un PDF de pedido usando HTML
 * @param {Object} pedido - Datos del pedido
 * @param {boolean} autoPrint - Si debe imprimir automáticamente
 */
export const generarPDFPedido = async (pedido, autoPrint = true) => {
  try {
    console.log('🚀 Iniciando generación de PDF de pedido con HTML...');
    
    // Cargar imágenes
    const logoImage = await getLogo();
    const backgroundImage = await loadBackgroundImage();
    
    // Crear HTML del pedido
    const htmlContent = createPedidoHTML(pedido, logoImage, backgroundImage);
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `pedido_${pedido.numero_pedido || pedido.id}_${fecha}.pdf`;
    
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
    console.error('❌ Error al generar PDF de pedido:', error);
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
      id: 'TEST001',
      numero_pedido: 'PED-2024-001',
      fecha_creacion: new Date().toISOString(),
      estado_pedido: 'confirmado',
      tipo_venta: 'fisica',
      estado_pago: 'pagado',
      metodo_pago: 'Tarjeta de crédito',
      cliente: {
        nombre: 'María González',
        telefono: '3001234567',
        email: 'maria.gonzalez@email.com',
        direccion: 'Calle 123 # 45-67, Bogotá'
      },
      direccion_entrega: 'Calle 123 # 45-67, Bogotá',
      telefono_contacto: '3001234567',
      instrucciones_entrega: 'Entregar en horario de oficina',
      items: [
        {
          producto: { nombre: 'Blusa Elegante', sku: 'BLU-001' },
          color: { nombre: 'Rosa' },
          cantidad: 2,
          precio_unitario: 45.50,
          subtotal: 91.00
        },
        {
          producto: { nombre: 'Pantalón Clásico', sku: 'PAN-002' },
          color: { nombre: 'Negro' },
          cantidad: 1,
          precio_unitario: 65.75,
          subtotal: 65.75
        },
        {
          producto: { nombre: 'Accesorio Decorativo', sku: 'ACC-003' },
          cantidad: 3,
          precio_unitario: 12.25,
          subtotal: 36.75
        }
      ],
      total: 193.50,
      codigo_seguimiento: 'TRK-123456789',
      empresa_envio: 'Servientrega',
      notas: 'Pedido especial con instrucciones de empaque específicas. Cliente solicita entrega antes del mediodía.'
    };
    
    const pdf = await generarPDFPedido(pedidoPrueba, false);
    console.log('✅ PDF de pedido de prueba generado exitosamente');
    return pdf;
    
  } catch (error) {
    console.error('❌ Error en la prueba de generación de PDF de pedido:', error);
    throw error;
  }
}; 