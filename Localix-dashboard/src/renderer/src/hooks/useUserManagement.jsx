import { useState, useCallback } from 'react';
import { useToast } from './useToast';

export const useUserManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/usuarios/gestion/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            usuarios: data.usuarios,
            estadisticas: data.estadisticas
          };
        } else {
          showToast(data.message || 'Error al cargar usuarios', 'error');
          return null;
        }
      } else {
        showToast('Error al cargar usuarios', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      showToast('Error de conexión', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/usuarios/gestion/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(data.message, 'success');
        return data.usuario;
      } else {
        showToast(data.message || 'Error al crear usuario', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Error de conexión', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/usuarios/usuarios/${userId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(data.message, 'success');
        return data.user;
      } else {
        showToast(data.message || 'Error al actualizar usuario', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Error de conexión', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/usuarios/usuarios/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showToast('Usuario eliminado exitosamente', 'success');
        return true;
      } else {
        const data = await response.json();
        showToast(data.message || 'Error al eliminar usuario', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error de conexión', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const toggleUserStatus = useCallback(async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/usuarios/usuarios/${userId}/toggle-status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(data.message, 'success');
        return data.user;
      } else {
        showToast(data.message || 'Error al cambiar estado', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      showToast('Error de conexión', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    loading,
    fetchUsuarios,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
  };
}; 