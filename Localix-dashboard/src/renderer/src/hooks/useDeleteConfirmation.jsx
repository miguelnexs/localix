import { useState, useCallback } from 'react';
import { useToast } from './useToast';

export const useDeleteConfirmation = () => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemName: '',
    itemType: 'elemento',
    onConfirm: null,
    dangerLevel: 'medium'
  });

  const toast = useToast();

  const showDeleteConfirmation = useCallback(({
    itemName,
    itemType = 'elemento',
    onConfirm,
    dangerLevel = 'medium',
    title = 'Confirmar eliminación',
    message = '¿Estás seguro de que deseas eliminar este elemento?'
  }) => {
    setDeleteModal({
      isOpen: true,
      itemName,
      itemType,
      onConfirm,
      dangerLevel,
      title,
      message
    });
  }, []);

  const hideDeleteConfirmation = useCallback(() => {
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirmDelete = useCallback(async (deleteFunction, itemName, itemType = 'elemento') => {
    return new Promise((resolve) => {
      showDeleteConfirmation({
        itemName,
        itemType,
        onConfirm: async () => {
          try {
            console.log('🔄 Ejecutando función de eliminación...');
            await deleteFunction();
            console.log('✅ Función de eliminación completada exitosamente');
            toast.showDeleteSuccess(itemName);
            resolve(true);
          } catch (error) {
            console.error('❌ Error en confirmDelete:', error);
            toast.error('Error al eliminar', `No se pudo eliminar ${itemType.toLowerCase()}: ${error.message}`);
            resolve(false);
          }
        }
      });
    });
  }, [showDeleteConfirmation, toast]);

  // Métodos específicos para diferentes tipos de elementos
  const confirmDeleteProduct = useCallback(async (deleteFunction, productName) => {
    return confirmDelete(deleteFunction, productName, 'producto');
  }, [confirmDelete]);

  const confirmDeleteCategory = useCallback(async (deleteFunction, categoryName) => {
    return confirmDelete(deleteFunction, categoryName, 'categoría');
  }, [confirmDelete]);

  const confirmDeleteClient = useCallback(async (deleteFunction, clientName) => {
    return confirmDelete(deleteFunction, clientName, 'cliente');
  }, [confirmDelete]);

  const confirmDeleteSale = useCallback(async (deleteFunction, saleId) => {
    return confirmDelete(deleteFunction, `Venta #${saleId}`, 'venta');
  }, [confirmDelete]);

  const confirmDeleteColor = useCallback(async (deleteFunction, colorName) => {
    return confirmDelete(deleteFunction, colorName, 'color');
  }, [confirmDelete]);

  const confirmDeleteVariant = useCallback(async (deleteFunction, variantName) => {
    return confirmDelete(deleteFunction, variantName, 'variante');
  }, [confirmDelete]);

  return {
    deleteModal,
    showDeleteConfirmation,
    hideDeleteConfirmation,
    confirmDelete,
    confirmDeleteProduct,
    confirmDeleteCategory,
    confirmDeleteClient,
    confirmDeleteSale,
    confirmDeleteColor,
    confirmDeleteVariant
  };
}; 