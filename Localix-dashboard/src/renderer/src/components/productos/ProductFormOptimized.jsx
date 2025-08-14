import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { CheckCircle, AlertCircle, Info, Save, X, DollarSign, Image, FolderOpen, Truck, Palette, Search, Package } from 'lucide-react';
import ProductFormColorsOptimized from './ProductFormColorsOptimized';
import { API_URL, RESOURCE_URL } from '../../api/apiConfig';
import { useCategoriesCache } from '../../hooks/useCategoriesCache';
import OptimizedLoading from '../ui/OptimizedLoading';

// Constantes
const PRODUCT_TYPES = [{ value: 'fisico', label: 'Físico' }, { value: 'digital', label: 'Digital' }, { value: 'servicio', label: 'Servicio' }];
const PRODUCT_STATUSES = [{ value: 'borrador', label: 'Borrador' }, { value: 'publicado', label: 'Publicado' }, { value: 'agotado', label: 'Agotado' }, { value: 'descontinuado', label: 'Descontinuado' }];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const API_BASE_URL = 'http://72.60.7.133:8000/api';

// Hook personalizado para cargar datos en paralelo
const useInitialData = (productToEdit, slugFromParams) => {
  const [data, setData] = useState({
    product: null,
    generalCategory: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el hook de cache de categorías
  const { categories, loading: categoriesLoading, error: categoriesError, ensureGeneralCategory } = useCategoriesCache();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const validSlug = productToEdit?.slug || (slugFromParams && slugFromParams !== 'producto' ? slugFromParams : null);
        
        // Cargar datos en paralelo
        const [generalCategory, productData] = await Promise.allSettled([
          ensureGeneralCategory(),
          validSlug ? window.electronAPI.productos.obtener(validSlug) : Promise.resolve(null)
        ]);

        setData({
          product: productData.value || null,
          generalCategory: generalCategory.value
        });
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar datos si las categorías ya están disponibles
    if (!categoriesLoading) {
      loadData();
    }
  }, [productToEdit, slugFromParams, categoriesLoading, ensureGeneralCategory]);

  return { 
    data: { ...data, categories }, 
    loading: loading || categoriesLoading, 
    error: error || categoriesError 
  };
};

// Componente memoizado para el formulario de precios
const PriceInput = React.memo(({ label, name, register, errors, onBlur, onFocus, placeholder = "0", required = false }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-theme-textSecondary">
      {label}
    </label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-textSecondary w-4 h-4" />
      <input
        type="text"
        {...register(name, required ? { 
          required: 'Este campo es obligatorio',
          min: { value: 0, message: 'El valor debe ser mayor o igual a 0' }
        } : {})}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        className="pl-10 w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
      />
    </div>
    {errors[name] && (
      <p className="text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
));

// Componente memoizado para el selector de categorías
const CategorySelect = React.memo(({ categories, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-theme-textSecondary">
      Categoría *
    </label>
    <select
      value={value || ''}
      onChange={onChange}
      className="w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
    >
      <option value="">Seleccionar categoría</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.nombre}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
));

export default function ProductFormOptimized({ productToEdit, onSuccess, onCancel, compact = false }) {
  const { slug: slugFromParams } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [productId, setProductId] = useState(null);

  // Usar el hook personalizado para cargar datos
  const { data, loading, error } = useInitialData(productToEdit, slugFromParams);

  // Funciones memoizadas para formatear precios
  const formatPrice = useCallback((value) => {
    if (!value || value === '' || isNaN(value)) return '';
    const num = parseFloat(value);
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  }, []);

  const parsePriceInput = useCallback((value) => {
    if (!value || value === '') return 0;
    const cleanValue = value.toString().replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const handlePriceBlur = useCallback((fieldName) => (e) => {
    const value = e.target.value;
    if (value && value !== '') {
      const parsedValue = parsePriceInput(value);
      const formattedValue = formatPrice(parsedValue);
      setValue(fieldName, parsedValue);
      e.target.value = formattedValue;
    } else {
      if (fieldName === 'precio_comparacion') {
        setValue(fieldName, null);
        e.target.value = '';
      } else {
        setValue(fieldName, 0);
        e.target.value = '0';
      }
    }
  }, [formatPrice, parsePriceInput]);

  const handlePriceFocus = useCallback((e) => {
    if (e.target.value === '0' || e.target.value === '0.00' || e.target.value === '') {
      e.target.value = '';
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      sku: '',
      tipo: 'fisico',
      estado: 'borrador',
      descripcion_corta: 'Descripción breve del producto',
      descripcion_larga: 'Descripción detallada del producto con características y beneficios',
      precio: 0,
      precio_comparacion: null,
      costo: 0,
      gestion_stock: true,
      stock: 0,
      stock_minimo: 5,
      peso: 0,
      dimensiones: '',
      categoria_id: '',
      meta_titulo: '',
      meta_descripcion: '',
      imagen_principal: null
    }
  });

  // Validaciones memoizadas
  const validateImageRequired = useCallback(() => {
    if (!productToEdit && !watch('imagen_principal')) {
      setError('La imagen principal es obligatoria.');
      return false;
    }
    return true;
  }, [productToEdit, watch]);

  const validateCategoryRequired = useCallback(() => {
    const categoriaId = watch('categoria_id');
    if (!categoriaId || categoriaId === '') {
      setError('Debes seleccionar una categoría para el producto.');
      return false;
    }
    return true;
  }, [watch]);

  // Efecto para inicializar el formulario cuando se cargan los datos
  useEffect(() => {
    if (!loading && data) {
      if (data.product) {
        // Editar producto existente
        reset({
          ...data.product,
          nombre: data.product.nombre || '',
          categoria_id: data.product.categoria?.id || data.generalCategory?.id || null,
          precio: parseFloat(data.product.precio || 0),
          precio_comparacion: data.product.precio_comparacion ? parseFloat(data.product.precio_comparacion) : null,
          costo: parseFloat(data.product.costo || 0),
          stock_minimo: data.product.stock_minimo || 5,
          peso: data.product.peso || 0
        });
        setProductId(data.product.id);
        if (data.product.imagen_principal_url) {
          setImagePreview(data.product.imagen_principal_url);
        }
      } else {
        // Nuevo producto
        if (data.generalCategory) {
          setValue('categoria_id', data.generalCategory.id);
        }
      }
    }
  }, [loading, data, reset, setValue]);

  // Asegurar que la pestaña activa sea válida
  useEffect(() => {
    if (!productToEdit && activeTab === 'colores') {
      setActiveTab('general');
    }
  }, [productToEdit, activeTab]);

  // Manejo de imagen optimizado
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setError('La imagen no debe superar los 5MB.');
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('Tipo de imagen no válido. Use JPG, PNG o WebP.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(',')[1];
        setImagePreview(e.target.result);
        setValue('imagen_principal', {
          file: file,
          base64: base64Data,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

  // Función de envío optimizada
  const onSubmit = useCallback(async (formData) => {
    if (!validateImageRequired() || !validateCategoryRequired()) {
      return;
    }

    try {
      // Estandarizar imagen_principal al formato esperado por el handler del main process
      let imagenEstandarizada = null;
      if (formData.imagen_principal?.file || formData.imagen_principal?.base64) {
        const file = formData.imagen_principal.file;
        const base64 = formData.imagen_principal.base64;
        imagenEstandarizada = {
          name: file?.name || 'imagen.jpg',
          type: file?.type || 'image/jpeg',
          size: file?.size,
          lastModified: file?.lastModified,
          data: base64 || null
        };
      }

      const productData = {
        ...formData,
        imagen_principal: imagenEstandarizada
      };

      let result;
      if (productToEdit) {
        result = await window.electronAPI.productos.actualizarOptimizado({ slug: productToEdit.slug, productData });
      } else {
        result = await window.electronAPI.productos.crearOptimizado(productData);
      }

      if (result.success) {
        toast.success(productToEdit ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        if (onSuccess) {
          onSuccess(result.data);
        } else {
          navigate('/productos');
        }
      } else {
        setError(result.message || 'Error al guardar el producto');
      }
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    }
  }, [productToEdit, validateImageRequired, validateCategoryRequired, toast, onSuccess, navigate]);

  // Renderizado condicional para mostrar loading
  if (loading) {
    return <OptimizedLoading message="Cargando formulario..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-theme-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-theme-text">
              {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-theme-textSecondary bg-theme-surface border border-theme-border rounded-md hover:bg-theme-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 inline mr-2" />
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-theme-border">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-theme-textSecondary hover:text-theme-textSecondary hover:border-theme-border'
            }`}
          >
            General
          </button>
          {productToEdit && (
            <button
              onClick={() => setActiveTab('colores')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'colores'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-theme-textSecondary hover:text-theme-textSecondary hover:border-theme-border'
              }`}
            >
              Colores
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'general' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-theme-textSecondary">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  className="w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
                  placeholder="Nombre del producto"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-theme-textSecondary">
                  SKU *
                </label>
                <input
                  type="text"
                  {...register('sku', { 
                    required: 'El SKU es obligatorio',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  })}
                  className="w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
                  placeholder="SKU del producto (mínimo 3 caracteres)"
                />
                {errors.sku && (
                  <p className="text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>
            </div>

            {/* Categoría y tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategorySelect
                categories={data.categories}
                value={watch('categoria_id')}
                onChange={(e) => setValue('categoria_id', e.target.value)}
                error={errors.categoria_id?.message}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-theme-textSecondary">
                  Tipo de producto
                </label>
                <select
                  {...register('tipo')}
                  className="w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
                >
                  {PRODUCT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PriceInput
                label="Precio de venta *"
                name="precio"
                register={register}
                errors={errors}
                onBlur={handlePriceBlur('precio')}
                onFocus={handlePriceFocus}
              />
              <PriceInput
                label="Precio de comparación"
                name="precio_comparacion"
                register={register}
                errors={errors}
                onBlur={handlePriceBlur('precio_comparacion')}
                onFocus={handlePriceFocus}
              />
              <PriceInput
                label="Costo *"
                name="costo"
                register={register}
                errors={errors}
                onBlur={handlePriceBlur('costo')}
                onFocus={handlePriceFocus}
                required={true}
              />
            </div>

            {/* Imagen principal */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-theme-textSecondary">
                Imagen principal {!productToEdit && '*'}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-theme-border border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setValue('imagen_principal', null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Image className="mx-auto h-12 w-12 text-theme-textSecondary" />
                  )}
                  <div className="flex text-sm text-theme-textSecondary">
                    <label className="relative cursor-pointer bg-theme-surface rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Subir imagen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-theme-textSecondary">PNG, JPG, WebP hasta 5MB</p>
                </div>
              </div>
            </div>

            {/* Descripciones */}
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-theme-textSecondary">
                  Descripción corta *
                </label>
                <textarea
                  {...register('descripcion_corta', { 
                    required: 'La descripción corta es obligatoria',
                    minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
                  placeholder="Descripción breve del producto (mínimo 10 caracteres)"
                />
                {errors.descripcion_corta && (
                  <p className="text-sm text-red-600">{errors.descripcion_corta.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-theme-textSecondary">
                  Descripción larga *
                </label>
                <textarea
                  {...register('descripcion_larga', { 
                    required: 'La descripción larga es obligatoria',
                    minLength: { value: 20, message: 'Mínimo 20 caracteres' }
                  })}
                  rows={6}
                  className="w-full px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text"
                  placeholder="Descripción detallada del producto (mínimo 20 caracteres)"
                />
                {errors.descripcion_larga && (
                  <p className="text-sm text-red-600">{errors.descripcion_larga.message}</p>
                )}
              </div>
            </div>
          </form>
                 ) : (
           <ProductFormColorsOptimized
             productId={productId}
             onColorsChange={() => {}}
           />
         )}
      </div>
    </div>
  );
}
