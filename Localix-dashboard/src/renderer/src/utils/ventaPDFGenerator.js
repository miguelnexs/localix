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

// Función para crear el HTML del recibo
const createReciboHTML = (venta, logoImage, backgroundImage) => {
  const fecha = new Date(venta.fecha_venta).toLocaleString('es-ES');
  const clienteNombre = venta.cliente?.nombre || venta.cliente_nombre || 'Cliente General';
  const clienteTelefono = venta.cliente?.telefono || '';
  const clienteEmail = venta.cliente?.email || '';
  
  // Calcular subtotal
  const subtotal = venta.items?.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0) || 0;
  
  // Generar filas de productos
  const productosHTML = venta.items?.map(item => {
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
        <title>Recibo de Venta</title>
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
            
            /* Información de la venta */
            .venta-info {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .venta-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #dee2e6;
            }
            
            .venta-numero {
                font-size: 20px;
                font-weight: bold;
                color: #333;
            }
            
            .venta-fecha {
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
            
            /* Método de pago */
            .pago-section {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .pago-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .pago-label {
                font-weight: bold;
                color: #333;
            }
            
            .pago-valor {
                color: #333;
                font-weight: 500;
            }
            
            /* Observaciones */
            ${venta.observaciones ? `
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
            
            <!-- Información de la venta -->
            <div class="venta-info">
                <div class="venta-header">
                    <div class="venta-numero">VENTA #${venta.numero_venta || venta.id}</div>
                    <div class="venta-fecha">${fecha}</div>
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
                        <span class="cliente-label">Vendedor:</span>
                        <span class="cliente-valor">${venta.vendedor || 'Sistema'}</span>
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
                    
                    ${venta.porcentaje_descuento && venta.porcentaje_descuento > 0 ? `
                    <div class="total-item">
                        <span class="total-label">Descuento (${venta.porcentaje_descuento}%):</span>
                        <span class="total-valor">-$${((subtotal * venta.porcentaje_descuento) / 100).toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    ${venta.precio_envio && venta.precio_envio > 0 ? `
                    <div class="total-item">
                        <span class="total-label">Envío:</span>
                        <span class="total-valor">$${venta.precio_envio.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    <div class="total-item total-final">
                        <span class="total-label">TOTAL:</span>
                        <span class="total-valor">$${venta.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Método de pago -->
            <div class="pago-section">
                <div class="pago-info">
                    <span class="pago-label">Método de pago:</span>
                    <span class="pago-valor">${venta.metodo_pago || 'Efectivo'}</span>
                </div>
            </div>
            
            ${venta.observaciones ? `
            <!-- Observaciones -->
            <div class="observaciones-section">
                <div class="observaciones-label">Observaciones:</div>
                <div class="observaciones-texto">${venta.observaciones}</div>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
                <h3>¡Gracias por su compra!</h3>
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
 * Genera un PDF de recibo para una venta usando HTML
 * @param {Object} venta - Datos de la venta
 * @param {boolean} autoPrint - Si debe imprimir automáticamente
 */
export const generarReciboVenta = async (venta, autoPrint = true) => {
  try {
    console.log('🚀 Iniciando generación de recibo con HTML...');
    
    // Cargar imágenes
    const logoImage = await getLogo();
    const backgroundImage = await loadBackgroundImage();
    
    // Crear HTML del recibo
    const htmlContent = createReciboHTML(venta, logoImage, backgroundImage);
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).replace(':', '-');
    const fileName = `recibo_${venta.numero_venta || venta.id}_${fecha}_${hora}.pdf`;
    
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
    console.error('❌ Error al generar recibo:', error);
    throw error;
  }
};

/**
 * Genera un recibo simple usando HTML
 * @param {Object} venta - Datos de la venta
 */
export const generarReciboSimple = async (venta) => {
  try {
    console.log('🚀 Iniciando generación de recibo simple con HTML...');
    
    // Cargar imágenes
    const logoImage = await getLogo();
    const backgroundImage = await loadBackgroundImage();
    
    // Crear HTML del recibo (mismo que el anterior)
    const htmlContent = createReciboHTML(venta, logoImage, backgroundImage);
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `recibo_simple_${venta.numero_venta || venta.id}_${fecha}.pdf`;
    
    // Generar PDF
    const pdf = await generatePDFFromHTML(htmlContent, fileName, 'a4');
    
    return pdf;
    
  } catch (error) {
    console.error('❌ Error al generar recibo simple:', error);
    throw error;
  }
};

/**
 * Función de prueba para verificar la carga de la imagen
 * Puedes llamar esta función desde la consola del navegador
 */
export const testLogoLoading = async () => {
  console.log('🧪 Iniciando prueba de carga de logo...');
  
  try {
    const logo = await getLogo();
    if (logo) {
      console.log('✅ Logo cargado exitosamente');
      console.log('📏 Tamaño del logo (caracteres):', logo.length);
      console.log('🔗 Tipo de logo:', logo.substring(0, 30) + '...');
      
      // Crear una imagen de prueba para verificar
      const img = new Image();
      img.onload = () => {
        console.log('✅ Imagen válida - Dimensiones:', img.width, 'x', img.height);
      };
      img.onerror = () => {
        console.log('❌ Error al cargar la imagen en el DOM');
      };
      img.src = logo;
      
      return logo;
    } else {
      console.log('❌ No se pudo cargar el logo');
      return null;
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    return null;
  }
};

/**
 * Función de prueba para verificar la carga de la imagen de fondo
 * Puedes llamar esta función desde la consola del navegador
 */
export const testBackgroundImageLoading = async () => {
  console.log('🧪 Iniciando prueba de carga de imagen de fondo...');
  
  try {
    const backgroundImage = await loadBackgroundImage();
    if (backgroundImage) {
      console.log('✅ Imagen de fondo cargada exitosamente');
      console.log('📏 Tamaño de la imagen de fondo (caracteres):', backgroundImage.length);
      console.log('🔗 Tipo de imagen de fondo:', backgroundImage.substring(0, 30) + '...');
      
      // Crear una imagen de prueba para verificar
      const img = new Image();
      img.onload = () => {
        console.log('✅ Imagen de fondo válida - Dimensiones:', img.width, 'x', img.height);
      };
      img.onerror = () => {
        console.log('❌ Error al cargar la imagen de fondo en el DOM');
      };
      img.src = backgroundImage;
      
      return backgroundImage;
    } else {
      console.log('❌ No se pudo cargar la imagen de fondo');
      return null;
    }
  } catch (error) {
    console.error('❌ Error en la prueba de imagen de fondo:', error);
    return null;
  }
};

/**
 * Función de prueba para generar un PDF de ejemplo
 */
export const testPDFGeneration = async () => {
  console.log('🧪 Iniciando prueba de generación de PDF...');
  
  try {
    // Datos de prueba
    const ventaPrueba = {
      id: 'TEST001',
      numero_venta: 'V-2024-001',
      fecha_venta: new Date().toISOString(),
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
      total: 66.75,
      metodo_pago: 'Efectivo',
      observaciones: 'Esta es una venta de prueba para verificar la generación de PDFs con HTML.'
    };
    
    const pdf = await generarReciboVenta(ventaPrueba, false);
    console.log('✅ PDF de prueba generado exitosamente');
    return pdf;
    
  } catch (error) {
    console.error('❌ Error en la prueba de generación de PDF:', error);
    throw error;
  }
};
