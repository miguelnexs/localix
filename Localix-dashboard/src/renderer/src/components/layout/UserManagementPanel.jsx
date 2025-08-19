import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Shield, 
  User,
  Search,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const UserManagementPanel = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Formulario de creación/edición
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    nombre_completo: '',
    telefono: '',
    rol: 'vendedor'
  });

  // Verificar si el usuario actual es admin
  const isAdmin = user?.rol === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsuarios();
    }
  }, [isAdmin]);

  const fetchUsuarios = async () => {
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
          setUsuarios(data.usuarios);
          setEstadisticas(data.estadisticas);
        }
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const response = await fetch('/api/usuarios/gestion/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(data.message, 'success');
        setShowCreateModal(false);
        resetForm();
        fetchUsuarios();
      } else {
        showToast(data.message || 'Error al crear usuario', 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Error al crear usuario', 'error');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
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
        fetchUsuarios();
      } else {
        showToast(data.message || 'Error al cambiar estado', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Error al cambiar estado', 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/usuarios/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showToast('Usuario eliminado exitosamente', 'success');
        fetchUsuarios();
      } else {
        const data = await response.json();
        showToast(data.message || 'Error al eliminar usuario', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error al eliminar usuario', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      password_confirm: '',
      nombre_completo: '',
      telefono: '',
      rol: 'vendedor'
    });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      password_confirm: '',
      nombre_completo: user.nombre_completo,
      telefono: user.telefono || '',
      rol: user.rol
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.password_confirm) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password_confirm;
      }

      const response = await fetch(`/api/usuarios/usuarios/${selectedUser.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(data.message, 'success');
        setShowEditModal(false);
        resetForm();
        fetchUsuarios();
      } else {
        showToast(data.message || 'Error al actualizar usuario', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Error al actualizar usuario', 'error');
    }
  };

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter(user => {
    const matchesSearch = user.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = filterRol === 'todos' || user.rol === filterRol;
    const matchesStatus = filterStatus === 'todos' || 
                         (filterStatus === 'activos' && user.es_activo) ||
                         (filterStatus === 'inactivos' && !user.es_activo);
    
    return matchesSearch && matchesRol && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-theme-accent mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-theme-text mb-2">
            Acceso Restringido
          </h3>
          <p className="text-theme-textSecondary">
            Solo los administradores pueden gestionar usuarios
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-theme-text mb-2">
            Gestión de Usuarios
          </h3>
          <p className="text-sm text-theme-textSecondary">
            Administra usuarios del sistema (administradores y vendedores)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
        >
          <UserPlus size={16} />
          Crear Usuario
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-theme-secondary p-4 rounded-lg border border-theme-border">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-theme-accent" />
              <div>
                <p className="text-sm text-theme-textSecondary">Total Usuarios</p>
                <p className="text-2xl font-bold text-theme-text">{estadisticas.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-theme-secondary p-4 rounded-lg border border-theme-border">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-theme-textSecondary">Administradores</p>
                <p className="text-2xl font-bold text-theme-text">{estadisticas.admins?.total || 0}</p>
                <p className="text-xs text-theme-textSecondary">
                  {estadisticas.admins?.activos || 0} activos
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-theme-secondary p-4 rounded-lg border border-theme-border">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-theme-textSecondary">Vendedores</p>
                <p className="text-2xl font-bold text-theme-text">{estadisticas.vendedores?.total || 0}</p>
                <p className="text-xs text-theme-textSecondary">
                  {estadisticas.vendedores?.activos || 0} activos
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-theme-secondary p-4 rounded-lg border border-theme-border">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-theme-textSecondary">Usuarios Activos</p>
                <p className="text-2xl font-bold text-theme-text">
                  {(estadisticas.admins?.activos || 0) + (estadisticas.vendedores?.activos || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-textSecondary w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
          />
        </div>
        
        <select
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          className="px-4 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
        >
          <option value="todos">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="vendedor">Vendedores</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
        >
          <option value="todos">Todos los estados</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
        
        <button
          onClick={fetchUsuarios}
          className="px-4 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text hover:bg-theme-secondary/80 transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-theme-secondary rounded-lg border border-theme-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent mx-auto"></div>
            <p className="text-theme-textSecondary mt-2">Cargando usuarios...</p>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-theme-textSecondary mx-auto mb-4" />
            <p className="text-theme-textSecondary">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-theme-secondary/50 border-b border-theme-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-theme-secondary/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-theme-text">
                          {usuario.nombre_completo}
                        </div>
                        <div className="text-sm text-theme-textSecondary">
                          {usuario.username} • {usuario.email}
                        </div>
                        {usuario.telefono && (
                          <div className="text-xs text-theme-textSecondary">
                            📞 {usuario.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.rol === 'admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {usuario.rol === 'admin' ? (
                          <>
                            <Shield size={12} className="mr-1" />
                            Administrador
                          </>
                        ) : (
                          <>
                            <User size={12} className="mr-1" />
                            Vendedor
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.es_activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.es_activo ? (
                          <>
                            <UserCheck size={12} className="mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <UserX size={12} className="mr-1" />
                            Inactivo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-textSecondary">
                      {usuario.ultimo_acceso 
                        ? new Date(usuario.ultimo_acceso).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Nunca'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(usuario)}
                          className="text-theme-accent hover:text-theme-accent/80 transition-colors"
                          title="Editar usuario"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleToggleStatus(usuario.id)}
                          className={`transition-colors ${
                            usuario.es_activo 
                              ? 'text-orange-500 hover:text-orange-600' 
                              : 'text-green-500 hover:text-green-600'
                          }`}
                          title={usuario.es_activo ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {usuario.es_activo ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        
                        {usuario.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(usuario.id, usuario.nombre_completo)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear Usuario */}
      {showCreateModal && (
        <UserFormModal
          title="Crear Nuevo Usuario"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateUser}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          isEdit={false}
        />
      )}

      {/* Modal de Editar Usuario */}
      {showEditModal && (
        <UserFormModal
          title="Editar Usuario"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditUser}
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
          isEdit={true}
        />
      )}
    </div>
  );
};

// Componente Modal para formulario de usuario
const UserFormModal = ({ title, formData, setFormData, onSubmit, onClose, isEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-theme-secondary rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-theme-textSecondary hover:text-theme-text transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
              disabled={isEdit}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={formData.nombre_completo}
              onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Rol *
            </label>
            <select
              required
              value={formData.rol}
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
            >
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Contraseña {isEdit ? '' : '*'}
            </label>
            <input
              type="password"
              required={!isEdit}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
              placeholder={isEdit ? "Dejar vacío para mantener la actual" : ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Confirmar Contraseña {isEdit ? '' : '*'}
            </label>
            <input
              type="password"
              required={!isEdit}
              value={formData.password_confirm}
              onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
              className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
              placeholder={isEdit ? "Dejar vacío para mantener la actual" : ""}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text hover:bg-theme-secondary/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
            >
              {isEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementPanel; 