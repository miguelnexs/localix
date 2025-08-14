// Ejemplos de uso de la API de Colores e Imágenes desde el frontend

// Configuración base
const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para manejar errores
function handleApiError(error) {
    console.error('Error en la API:', error);
    if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
}

// 1. Crear un color con imágenes
async function crearColorConImagenes(colorData, imagenes) {
    try {
        const formData = new FormData();
        
        // Datos del color
        formData.append('producto', colorData.producto);
        formData.append('nombre', colorData.nombre);
        formData.append('codigo_color', colorData.codigo_color);
        formData.append('stock', colorData.stock);
        formData.append('orden', colorData.orden || 1);
        formData.append('es_principal', colorData.es_principal || false);
        
        // Agregar imágenes
        imagenes.forEach((imagen, index) => {
            formData.append('imagenes_subidas', imagen);
        });
        
        const response = await fetch(`${API_BASE_URL}/colores/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${getAuthToken()}` // Función para obtener el token
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Color creado:', data);
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 2. Actualizar un color con nuevas imágenes
async function actualizarColorConImagenes(colorId, colorData, nuevasImagenes, imagenesAEliminar = [], imagenesAReordenar = []) {
    try {
        const formData = new FormData();
        
        // Datos del color
        Object.keys(colorData).forEach(key => {
            formData.append(key, colorData[key]);
        });
        
        // Agregar nuevas imágenes
        nuevasImagenes.forEach(imagen => {
            formData.append('imagenes_subidas', imagen);
        });
        
        // IDs de imágenes a eliminar
        if (imagenesAEliminar.length > 0) {
            formData.append('imagenes_a_eliminar', JSON.stringify(imagenesAEliminar));
        }
        
        // IDs de imágenes a reordenar
        if (imagenesAReordenar.length > 0) {
            formData.append('imagenes_a_reordenar', JSON.stringify(imagenesAReordenar));
        }
        
        const response = await fetch(`${API_BASE_URL}/colores/${colorId}/`, {
            method: 'PATCH',
            body: formData,
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Color actualizado:', data);
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 3. Subir múltiples imágenes para un color
async function subirMultiplesImagenes(colorId, imagenes) {
    try {
        const formData = new FormData();
        formData.append('color_id', colorId);
        
        imagenes.forEach(imagen => {
            formData.append('imagenes', imagen);
        });
        
        const response = await fetch(`${API_BASE_URL}/imagenes-color/upload_multiple/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Imágenes subidas:', data);
        
        // Mostrar errores si los hay
        if (data.errores && data.errores.length > 0) {
            console.warn('Errores durante la subida:', data.errores);
        }
        
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 4. Eliminar múltiples imágenes
async function eliminarMultiplesImagenes(imagenIds) {
    try {
        const response = await fetch(`${API_BASE_URL}/imagenes-color/bulk_delete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                imagen_ids: imagenIds
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Imágenes eliminadas:', data);
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 5. Reordenar imágenes
async function reordenarImagenes(ordenData) {
    try {
        const response = await fetch(`${API_BASE_URL}/imagenes-color/bulk_reorder/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                orden: ordenData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Imágenes reordenadas:', data);
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 6. Establecer imagen como principal
async function establecerImagenPrincipal(colorId, imagenId) {
    try {
        const response = await fetch(`${API_BASE_URL}/colores/${colorId}/set_imagen_principal/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                imagen_id: imagenId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Imagen establecida como principal:', data);
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 7. Obtener información detallada de imágenes de un color
async function obtenerInfoImagenes(colorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/colores/${colorId}/imagenes_info/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Información de imágenes:', data);
        return data;
        
    } catch (error) {
        handleApiError(error);
    }
}

// 8. Validar archivo de imagen antes de subir
function validarImagen(archivo) {
    const errores = [];
    
    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
        errores.push('Tipo de archivo no permitido. Use JPEG, PNG o WEBP');
    }
    
    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (archivo.size > maxSize) {
        errores.push('El archivo es demasiado grande. Tamaño máximo: 5MB');
    }
    
    // Validar nombre
    const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = archivo.name.toLowerCase().substring(archivo.name.lastIndexOf('.'));
    if (!extensionesPermitidas.includes(extension)) {
        errores.push('Extensión de archivo no permitida');
    }
    
    return {
        esValido: errores.length === 0,
        errores: errores
    };
}

// 9. Función para manejar la subida de archivos con drag & drop
function setupDragAndDrop(containerId, onFilesSelected) {
    const container = document.getElementById(containerId);
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('drag-over');
    });
    
    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
    });
    
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        const imagenesValidas = [];
        const errores = [];
        
        files.forEach(file => {
            const validacion = validarImagen(file);
            if (validacion.esValido) {
                imagenesValidas.push(file);
            } else {
                errores.push(`${file.name}: ${validacion.errores.join(', ')}`);
            }
        });
        
        if (errores.length > 0) {
            alert('Errores de validación:\n' + errores.join('\n'));
        }
        
        if (imagenesValidas.length > 0) {
            onFilesSelected(imagenesValidas);
        }
    });
}

// 10. Función para mostrar preview de imágenes
function mostrarPreviewImagenes(imagenes, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    imagenes.forEach((imagen, index) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${URL.createObjectURL(imagen)}" alt="Preview ${index + 1}" />
            <span class="image-name">${imagen.name}</span>
            <span class="image-size">${(imagen.size / 1024 / 1024).toFixed(2)} MB</span>
            <button onclick="removerImagen(${index})" class="remove-btn">×</button>
        `;
        container.appendChild(preview);
    });
}

// Ejemplo de uso completo
async function ejemploUsoCompleto() {
    try {
        // 1. Crear un color con imágenes
        const colorData = {
            producto: 1,
            nombre: 'Azul Marino',
            codigo_color: '#000080',
            stock: 25,
            orden: 1,
            es_principal: false
        };
        
        // Simular archivos de imagen (en un caso real, estos vendrían del input file)
        const imagenes = []; // Array de File objects
        
        const colorCreado = await crearColorConImagenes(colorData, imagenes);
        
        // 2. Subir más imágenes para el color
        const nuevasImagenes = []; // Array de File objects
        const resultadoSubida = await subirMultiplesImagenes(colorCreado.id, nuevasImagenes);
        
        // 3. Reordenar imágenes
        const ordenNuevo = {
            '1': 3,
            '2': 1,
            '3': 2
        };
        await reordenarImagenes(ordenNuevo);
        
        // 4. Establecer imagen principal
        await establecerImagenPrincipal(colorCreado.id, 2);
        
        // 5. Obtener información actualizada
        const infoImagenes = await obtenerInfoImagenes(colorCreado.id);
        
        console.log('Proceso completado exitosamente');
        
    } catch (error) {
        console.error('Error en el proceso:', error);
    }
}

// Función helper para obtener token de autenticación
function getAuthToken() {
    // Implementar según tu sistema de autenticación
    return localStorage.getItem('authToken') || '';
}

// Exportar funciones para uso en otros módulos
export {
    crearColorConImagenes,
    actualizarColorConImagenes,
    subirMultiplesImagenes,
    eliminarMultiplesImagenes,
    reordenarImagenes,
    establecerImagenPrincipal,
    obtenerInfoImagenes,
    validarImagen,
    setupDragAndDrop,
    mostrarPreviewImagenes,
    ejemploUsoCompleto
}; 