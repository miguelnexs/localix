import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { RESOURCE_URL } from '../../api/apiConfig';

// Hook personalizado para cargar colores con cache
const useColorsData = (productId) => {
  const [colores, setColores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarColores = useCallback(async () => {
    if (!productId) {
      setColores([]);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await window.electronAPI.productos.obtenerColores(productId);
      
      if (response.success) {
        const coloresData = Array.isArray(response.data) ? response.data : [];
        setColores(coloresData);
      } else {
        setError('Error al cargar los colores');
        setColores([]);
      }
    } catch (error) {
      setError('Error de conexión');
      setColores([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    cargarColores();
  }, [cargarColores]);

  return { colores, loading, error, refetch: cargarColores };
};

// Hook personalizado para cargar imágenes con lazy loading
const useImagesData = () => {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarImagenes = useCallback(async (colorId) => {
    if (!colorId) {
      setImagenes([]);
      return;
    }

    setLoading(true);
    try {
      const response = await window.electronAPI.productos.obtenerImagenes(colorId);
      
      if (response.success) {
        const imagenesData = Array.isArray(response.data) ? response.data : [];
        setImagenes(imagenesData);
      } else {
        setImagenes([]);
      }
    } catch (error) {
      setImagenes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { imagenes, loading, cargarImagenes };
};

// Componente memoizado para mostrar un color
const ColorCard = React.memo(({ color, onEdit, onDelete, onViewImages }) => (
  <Card sx={{ minWidth: 200, m: 1 }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: color.hex_code,
              border: '2px solid #ddd',
              borderRadius: '50%',
              mr: 1
            }}
          />
          <Typography variant="h6" component="div">
            {color.nombre}
          </Typography>
        </Box>
        <Box>
          {color.activo ? (
            <Chip label="Activo" color="success" size="small" />
          ) : (
            <Chip label="Inactivo" color="default" size="small" />
          )}
        </Box>
      </Box>
      
             <Typography color="text.secondary" gutterBottom>
         Stock: {color.stock !== null && color.stock !== undefined ? color.stock : 'Sin stock'}
       </Typography>
      
      <Box display="flex" justifyContent="space-between" mt={2}>
        <IconButton size="small" onClick={() => onEdit(color)}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onViewImages(color)}>
          <PhotoCameraIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(color.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
));

// Componente memoizado para el diálogo de color
const ColorDialog = React.memo(({ open, onClose, color, onSave, formData, onFormChange }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      {color ? 'Editar Color' : 'Nuevo Color'}
    </DialogTitle>
    <DialogContent>
      <Box sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Nombre del color"
          value={formData.nombre}
          onChange={(e) => onFormChange('nombre', e.target.value)}
          margin="normal"
        />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Color
          </Typography>
          <ChromePicker
            color={formData.hex_code}
            onChange={(color) => onFormChange('hex_code', color.hex)}
          />
        </Box>
        
        <TextField
          fullWidth
          type="number"
          label="Stock"
          value={formData.stock === null || formData.stock === undefined ? '' : formData.stock}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              onFormChange('stock', '');
            } else {
              const numValue = parseInt(value);
              onFormChange('stock', isNaN(numValue) ? '' : numValue);
            }
          }}
          margin="normal"
          inputProps={{ min: 0 }}
          helperText="Cantidad disponible para este color (dejar vacío = sin stock)"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={formData.activo}
              onChange={(e) => onFormChange('activo', e.target.checked)}
            />
          }
          label="Activo"
          sx={{ mt: 2 }}
        />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} variant="contained">
        Guardar
      </Button>
    </DialogActions>
  </Dialog>
));

// Componente memoizado para el diálogo de imágenes
const ImagesDialog = React.memo(({ open, onClose, color, imagenes, loading, onUpload, onDelete, onSetMain }) => {
  const [imageTabValue, setImageTabValue] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      await onUpload(file, color.id);
    } finally {
      setUploadingImage(false);
    }
  }, [onUpload, color]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Imágenes de {color?.nombre}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Tabs value={imageTabValue} onChange={(_, newValue) => setImageTabValue(newValue)}>
            <Tab label="Subir Imagen" />
            <Tab label="Galería" />
          </Tabs>
          
          {imageTabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleUpload}
                disabled={uploadingImage}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={uploadingImage}
                  startIcon={uploadingImage ? <CircularProgress size={20} /> : <AddIcon />}
                >
                  {uploadingImage ? 'Subiendo...' : 'Seleccionar Imagen'}
                </Button>
              </label>
            </Box>
          )}
          
          {imageTabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {imagenes.map((imagen) => (
                    <Grid item xs={6} sm={4} md={3} key={imagen.id}>
                      <Card>
                        <img
                          src={imagen.url}
                          alt={imagen.nombre}
                          style={{ width: '100%', height: 120, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => onSetMain(imagen.id)}
                              color={imagen.es_principal ? 'primary' : 'default'}
                            >
                              {imagen.es_principal ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(imagen.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
});

const ProductFormColorsOptimized = ({ productId, onColorsChange }) => {
  // Estados para el diálogo de color
  const [openColorDialog, setOpenColorDialog] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [colorForm, setColorForm] = useState({
    nombre: '',
    hex_code: '#000000',
    stock: '',
    activo: true
  });
  
  // Estados para el diálogo de imágenes
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Estados de notificación
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Usar hooks personalizados
  const { colores, loading, error: colorsError, refetch: refetchColors } = useColorsData(productId);
  const { imagenes, loading: imagesLoading, cargarImagenes } = useImagesData();

  // Manejar cambios en el formulario de color
  const handleColorFormChange = useCallback((field, value) => {
    setColorForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Abrir diálogo para crear/editar color
  const handleOpenColorDialog = useCallback((color = null) => {
    if (color) {
      setEditingColor(color);
      setColorForm({
        nombre: color.nombre,
        hex_code: color.hex_code,
        stock: color.stock !== null && color.stock !== undefined ? color.stock : '',
        activo: color.activo
      });
    } else {
      setEditingColor(null);
      setColorForm({
        nombre: '',
        hex_code: '#000000',
        stock: '',
        activo: true
      });
    }
    setOpenColorDialog(true);
  }, []);

  // Guardar color
  const handleSaveColor = useCallback(async () => {
    try {
      // Manejar el valor del stock correctamente
      let stockValue = colorForm.stock;
      if (stockValue === '' || stockValue === null || stockValue === undefined) {
        stockValue = 0;
      } else if (typeof stockValue === 'string') {
        stockValue = parseInt(stockValue) || 0;
      } else if (typeof stockValue === 'number') {
        stockValue = stockValue < 0 ? 0 : stockValue;
      }
      
      const colorData = {
        nombre: colorForm.nombre,
        hex_code: colorForm.hex_code,
        stock: stockValue,
        activo: colorForm.activo,
        producto_id: productId
      };

      let result;
      if (editingColor) {
        result = await window.electronAPI.productos.actualizarColor(editingColor.id, colorData);
      } else {
        result = await window.electronAPI.productos.crearColor(colorData);
      }

      if (result.success) {
        setSuccess(editingColor ? 'Color actualizado exitosamente' : 'Color creado exitosamente');
        setOpenColorDialog(false);
        refetchColors();
        if (onColorsChange) {
          onColorsChange();
        }
      } else {
        setError(result.message || 'Error al guardar el color');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  }, [colorForm, editingColor, productId, refetchColors, onColorsChange]);

  // Eliminar color
  const handleDeleteColor = useCallback(async (colorId) => {
    try {
      const result = await window.electronAPI.productos.eliminarColor(colorId);
      
      if (result.success) {
        setSuccess('Color eliminado exitosamente');
        refetchColors();
        if (onColorsChange) {
          onColorsChange();
        }
      } else {
        setError(result.message || 'Error al eliminar el color');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  }, [refetchColors, onColorsChange]);

  // Abrir diálogo de imágenes
  const handleOpenImageDialog = useCallback(async (color) => {
    setSelectedColor(color);
    setOpenImageDialog(true);
    await cargarImagenes(color.id);
  }, [cargarImagenes]);

  // Subir imagen
  const handleUploadImage = useCallback(async (file, colorId) => {
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      formData.append('color_id', colorId);

      const result = await window.electronAPI.productos.subirImagenColor(formData);
      
      if (result.success) {
        setSuccess('Imagen subida exitosamente');
        await cargarImagenes(colorId);
      } else {
        setError(result.message || 'Error al subir la imagen');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  }, [cargarImagenes]);

  // Eliminar imagen
  const handleDeleteImage = useCallback(async (imagenId) => {
    try {
      const result = await window.electronAPI.productos.eliminarImagenColor(imagenId);
      
      if (result.success) {
        setSuccess('Imagen eliminada exitosamente');
        await cargarImagenes(selectedColor.id);
      } else {
        setError(result.message || 'Error al eliminar la imagen');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  }, [selectedColor, cargarImagenes]);

  // Establecer imagen principal
  const handleSetMainImage = useCallback(async (imagenId) => {
    try {
      const result = await window.electronAPI.productos.establecerImagenPrincipal(imagenId);
      
      if (result.success) {
        setSuccess('Imagen principal establecida');
        await cargarImagenes(selectedColor.id);
      } else {
        setError(result.message || 'Error al establecer imagen principal');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  }, [selectedColor, cargarImagenes]);

  // Memoizar la lista de colores
  const colorCards = useMemo(() => 
    colores.map(color => (
      <ColorCard
        key={color.id}
        color={color}
        onEdit={handleOpenColorDialog}
        onDelete={handleDeleteColor}
        onViewImages={handleOpenImageDialog}
      />
    )), [colores, handleOpenColorDialog, handleDeleteColor, handleOpenImageDialog]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          Colores del Producto
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenColorDialog()}
        >
          Agregar Color
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : colorsError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {colorsError}
        </Alert>
      ) : colores.length === 0 ? (
        <Box textAlign="center" p={3}>
          <PaletteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay colores configurados
          </Typography>
          <Typography color="text.secondary">
            Agrega colores para este producto
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {colorCards}
        </Grid>
      )}

      {/* Diálogo de color */}
      <ColorDialog
        open={openColorDialog}
        onClose={() => setOpenColorDialog(false)}
        color={editingColor}
        onSave={handleSaveColor}
        formData={colorForm}
        onFormChange={handleColorFormChange}
      />

      {/* Diálogo de imágenes */}
      <ImagesDialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        color={selectedColor}
        imagenes={imagenes}
        loading={imagesLoading}
        onUpload={handleUploadImage}
        onDelete={handleDeleteImage}
        onSetMain={handleSetMainImage}
      />

      {/* Notificaciones */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductFormColorsOptimized;
