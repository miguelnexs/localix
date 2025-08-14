import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePreloadedCategories } from '../../context/PreloadContext';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Hash,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// 🚀 COMPONENTE DE FORMULARIO DE PRODUCTOS CON PRE-CARGA
const ProductFormWithPreload = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = usePreloadedCategories();
  
  // 🚀 ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precio_anterior: '',
    stock: '',
    categoria: '',
    activo: true,
    imagen_principal: null,
    imagenes_adicionales: []
  });

  // 🚀 ESTADO DE CARGA Y ERRORES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // 🚀 ESTADO DE IMÁGENES
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // 🚀 CARGAR PRODUCTO PARA EDITAR
  useEffect(() => {
    const loadProductForEdit = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('🚀 Cargando producto para editar:', slug);
        
        // Usar el handler optimizado que carga producto con detalles
        const result = await window.electronAPI.productos.obtenerConDetalles(slug);
        
        if (result.product) {
          setProductToEdit(result.product);
          setIsEditing(true);
          
          // Llenar formulario con datos del producto
          setFormData({
            nombre: result.product.nombre || '',
            descripcion: result.product.descripcion || '',
            precio: result.product.precio || '',
            precio_anterior: result.product.precio_anterior || '',
            stock: result.product.stock || '',
            categoria: result.product.categoria?.id || '',
            activo: result.product.activo !== false,
            imagen_principal: null,
            imagenes_adicionales: []
          });

          // Configurar imágenes
          if (result.product.imagen_principal) {
            setMainImage(result.product.imagen_principal);
          }
          
          if (result.colors && result.colors.length > 0) {
            setAdditionalImages(result.colors.map(color => color.imagen).filter(Boolean));
          }
        }
      } catch (err) {
        console.error('🚀 Error al cargar producto:', err);
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductForEdit();
  }, [slug]);

  // 🚀 MANEJAR CAMBIOS EN EL FORMULARIO
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 🚀 MANEJAR SUBIDA DE IMAGEN PRINCIPAL
  const handleMainImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen_principal: file }));
      setMainImage(URL.createObjectURL(file));
    }
  }, []);

  // 🚀 MANEJAR SUBIDA DE IMÁGENES ADICIONALES
  const handleAdditionalImagesUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setAdditionalImages(prev => [...prev, ...files]);
    setFormData(prev => ({
      ...prev,
      imagenes_adicionales: [...prev.imagenes_adicionales, ...files]
    }));
  }, []);

  // 🚀 ELIMINAR IMAGEN ADICIONAL
  const removeAdditionalImage = useCallback((index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imagenes_adicionales: prev.imagenes_adicionales.filter((_, i) => i !== index)
    }));
  }, []);

  // 🚀 VALIDAR FORMULARIO
  const validateForm = useCallback(() => {
    const errors = [];

    if (!formData.nombre.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }

    if (!formData.categoria) {
      errors.push('Debe seleccionar una categoría');
    }

    if (formData.stock && parseInt(formData.stock) < 0) {
      errors.push('El stock no puede ser negativo');
    }

    return errors;
  }, [formData]);

  // 🚀 MANEJAR ENVÍO DEL FORMULARIO
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        precio_anterior: formData.precio_anterior ? parseFloat(formData.precio_anterior) : null,
        stock: formData.stock ? parseInt(formData.stock) : 0
      };

      let result;
      
      if (isEditing) {
        console.log('🚀 Actualizando producto:', productToEdit.slug);
        result = await window.electronAPI.productos.actualizarOptimizado(productToEdit.slug, productData);
      } else {
        console.log('🚀 Creando nuevo producto');
        result = await window.electronAPI.productos.crearOptimizado(productData);
      }

      // Subir imagen principal si se seleccionó una nueva
      if (formData.imagen_principal && !isEditing) {
        await window.electronAPI.productos.uploadImagenPrincipal({
          slug: result.slug,
          imageFile: formData.imagen_principal
        });
      }

      console.log('🚀 Producto guardado exitosamente');
      navigate('/productos');
      
    } catch (err) {
      console.error('🚀 Error al guardar producto:', err);
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  }, [formData, isEditing, productToEdit, validateForm, navigate]);

  // 🚀 RENDERIZAR CAMPO DE FORMULARIO
  const renderField = useCallback((label, field, type = 'text', options = {}) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-theme-textSecondary">
        {label}
        {options.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-theme-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={options.rows || 3}
          placeholder={options.placeholder}
        />
      ) : type === 'select' ? (
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-theme-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccionar {label.toLowerCase()}</option>
          {options.options?.map(option => (
            <option key={option.id} value={option.id}>
              {option.nombre}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.checked)}
            className="rounded border-theme-border text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-theme-textSecondary">{options.label}</span>
        </label>
      ) : (
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-theme-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={options.placeholder}
        />
      )}
    </div>
  ), [formData, handleInputChange]);

  // 🚀 RENDERIZAR SECCIÓN DE IMÁGENES
  const renderImageSection = useCallback(() => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-theme-text flex items-center space-x-2">
        <ImageIcon className="w-5 h-5" />
        <span>Imágenes del Producto</span>
      </h3>
      
      {/* Imagen Principal */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-theme-textSecondary">
          Imagen Principal
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
            id="main-image-upload"
          />
          <label
            htmlFor="main-image-upload"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Seleccionar Imagen</span>
          </label>
          
          {mainImage && (
            <div className="relative">
              <img
                src={mainImage}
                alt="Imagen principal"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setMainImage(null);
                  setFormData(prev => ({ ...prev, imagen_principal: null }));
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Imágenes Adicionales */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-theme-textSecondary">
          Imágenes Adicionales
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesUpload}
            className="hidden"
            id="additional-images-upload"
          />
          <label
            htmlFor="additional-images-upload"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Imágenes</span>
          </label>
        </div>
        
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {additionalImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeAdditionalImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ), [mainImage, additionalImages, handleMainImageUpload, handleAdditionalImagesUpload, removeAdditionalImage]);

  // 🚀 RENDERIZAR ESTADO DE CARGA
  if (isLoading && !productToEdit) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-theme-textSecondary">Cargando producto...</span>
        </div>
      </div>
    );
  }

  // 🚀 RENDERIZAR ERROR
  if (error && !productToEdit) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">Error: {error}</span>
          </div>
          <button
            onClick={() => navigate('/productos')}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 🚀 HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/productos')}
            className="flex items-center space-x-2 px-3 py-2 text-theme-textSecondary hover:text-theme-text"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-theme-text">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Guardando...' : 'Guardar Producto'}</span>
        </button>
      </div>

      {/* 🚀 ERROR */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* 🚀 FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🚀 INFORMACIÓN BÁSICA */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-theme-text flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Información Básica</span>
            </h3>
            
            {renderField('Nombre del Producto', 'nombre', 'text', { 
              required: true, 
              placeholder: 'Ej: Billetera de Cuero' 
            })}
            
            {renderField('Descripción', 'descripcion', 'textarea', { 
              rows: 4, 
              placeholder: 'Describe las características del producto...' 
            })}
            
            {renderField('Categoría', 'categoria', 'select', { 
              required: true, 
              options: categories || [] 
            })}
            
            {renderField('Activo', 'activo', 'checkbox', { 
              label: 'Producto disponible para venta' 
            })}
          </div>

          {/* 🚀 INFORMACIÓN DE PRECIOS Y STOCK */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-theme-text flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Precios y Stock</span>
            </h3>
            
            {renderField('Precio Actual', 'precio', 'number', { 
              required: true, 
              placeholder: '0.00' 
            })}
            
            {renderField('Precio Anterior (Opcional)', 'precio_anterior', 'number', { 
              placeholder: '0.00' 
            })}
            
            {renderField('Stock Disponible', 'stock', 'number', { 
              placeholder: '0' 
            })}
          </div>
        </div>

        {/* 🚀 SECCIÓN DE IMÁGENES */}
        {renderImageSection()}
      </form>
    </div>
  );
};

export default ProductFormWithPreload;
