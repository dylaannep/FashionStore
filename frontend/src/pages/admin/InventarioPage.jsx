import React, { useEffect, useState } from 'react';
import { inventarioService, variantesService, movimientosService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const InventarioPage = () => {
  const [inventarios, setInventarios] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear'); // 'crear' o 'movimiento'
  const [formData, setFormData] = useState({
    id_producto_variante: '',
    stock: '',
    stock_minimo: '',
  });
  const [formMovimiento, setFormMovimiento] = useState({
    id_producto_variante: '',
    tipo_movimiento: 'ENTRADA',
    cantidad: '',
    motivo: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [erroresMovimiento, setErroresMovimiento] = useState({});

  useEffect(() => {
    fetchInventarios();
    fetchVariantes();
  }, []);

  const fetchInventarios = async () => {
    setLoading(true);
    try {
      const response = await inventarioService.getAll();
      setInventarios(response.data);
    } catch (error) {
      console.error('Error fetching inventarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVariantes = async () => {
    try {
      const response = await variantesService.getAll();
      setVariantes(response.data);
    } catch (error) {
      console.error('Error fetching variantes:', error);
    }
  };

  const getVarianteName = (variante) => {
    if (!variante) return 'N/A';
    return `${variante.sku} - $${parseFloat(variante.precio).toFixed(2)}`;
  };

  const handleCrearMovimiento = (inventario) => {
    setFormMovimiento({
      id_producto_variante: inventario.id_producto_variante || '',
      tipo_movimiento: 'ENTRADA',
      cantidad: '',
      motivo: '',
    });
    setEditingId(inventario.id_inventario);
    setTipoModal('movimiento');
    setModalMovimiento(true);
  };

  const handleEdit = (item) => {
    setFormData({
      id_producto_variante: item.id_producto_variante || '',
      stock: item.stock || '',
      stock_minimo: item.stock_minimo || '',
    });
    setEditingId(item.id_inventario);
    setTipoModal('editar');
    setModalOpen(true);
  };

  const handleDelete = async (inventario) => {
    if (window.confirm(`¿Estás seguro de eliminar el inventario para esta variante?`)) {
      try {
        await inventarioService.delete(inventario.id_inventario);
        fetchInventarios();
      } catch (error) {
        console.error('Error deleting inventario:', error);
        alert('Error al eliminar el inventario');
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} el inventario de esta variante?`)) {
      try {
        await inventarioService.update(item.id_inventario, { activo: !item.activo });
        fetchInventarios();
      } catch (error) {
        console.error(`Error al ${accion} el inventario:`, error);
        alert(`Ocurrió un error al intentar ${accion} el inventario. Por favor, inténtalo de nuevo.`);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      id_producto_variante: '',
      stock: '',
      stock_minimo: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const handleMovimientoClose = () => {
    setModalMovimiento(false);
    setFormMovimiento({
      id_producto_variante: '',
      tipo_movimiento: 'ENTRADA',
      cantidad: '',
      motivo: '',
    });
    setErroresMovimiento({});
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setErrors({});
    const newErrors = {};

    if (!formData.id_producto_variante) {
      newErrors.id_producto_variante = 'Debe seleccionar una variante.';
    }
    if (!formData.stock) {
      newErrors.stock = 'El stock es obligatorio.';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0.';
    }
    if (!formData.stock_minimo) {
      newErrors.stock_minimo = 'El stock mínimo es obligatorio.';
    } else if (isNaN(formData.stock_minimo) || parseInt(formData.stock_minimo) < 0) {
      newErrors.stock_minimo = 'El stock mínimo debe ser un número mayor o igual a 0.';
    } else if (parseInt(formData.stock_minimo) > parseInt(formData.stock)) {
      newErrors.stock_minimo = 'El stock mínimo no puede ser mayor al stock actual.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      id_producto_variante: parseInt(formData.id_producto_variante),
      stock: parseInt(formData.stock),
      stock_minimo: parseInt(formData.stock_minimo),
    };

    try {
      if (editingId) {
        await inventarioService.update(editingId, dataToSend);
      } else {
        await inventarioService.create(dataToSend);
      }
      fetchInventarios();
      handleModalClose();
    } catch (error) {
      const mensaje = error?.response?.data?.error || '';
      const backendErrors = {};

      if (mensaje.toLowerCase().includes('variante')) {
        backendErrors.id_producto_variante = mensaje;
      } else if (mensaje.toLowerCase().includes('stock')) {
        backendErrors.stock = mensaje;
      } else {
        backendErrors.general = mensaje || 'Ocurrió un error al guardar. Intenta de nuevo.';
      }

      setErrors(backendErrors);
    }
  };

  const handleSubmitMovimiento = async () => {
    setErroresMovimiento({});
    const newErrors = {};

    if (!formMovimiento.id_producto_variante) {
      newErrors.id_producto_variante = 'Debe seleccionar una variante.';
    }
    if (!formMovimiento.cantidad) {
      newErrors.cantidad = 'La cantidad es obligatoria.';
    } else if (isNaN(formMovimiento.cantidad) || parseInt(formMovimiento.cantidad) <= 0) {
      newErrors.cantidad = 'La cantidad debe ser un número mayor a 0.';
    }
    if (!formMovimiento.motivo.trim()) {
      newErrors.motivo = 'El motivo es obligatorio.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErroresMovimiento(newErrors);
      return;
    }

    const dataToSend = {
      id_producto_variante: parseInt(formMovimiento.id_producto_variante),
      tipo_movimiento: formMovimiento.tipo_movimiento,
      cantidad: parseInt(formMovimiento.cantidad),
      motivo: formMovimiento.motivo,
    };

    try {
      await movimientosService.create(dataToSend);
      fetchInventarios();
      handleMovimientoClose();
    } catch (error) {
      const mensaje = error?.response?.data?.error || '';
      const backendErrors = {};

      if (mensaje.toLowerCase().includes('cantidad')) {
        backendErrors.cantidad = mensaje;
      } else if (mensaje.toLowerCase().includes('stock')) {
        backendErrors.general = mensaje;
      } else {
        backendErrors.general = mensaje || 'Ocurrió un error al procesar el movimiento. Intenta de nuevo.';
      }

      setErroresMovimiento(backendErrors);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditingId(null);
          setFormData({
            id_producto_variante: '',
            stock: '',
            stock_minimo: '',
          });
          setErrors({});
          setTipoModal('crear');
          setModalOpen(true);
        }}
      >
        Nuevo Inventario
      </button>
      <DataTable
        columns={[
          { key: 'id_producto_variante', label: 'Variante', render: (val) => {
            const variante = variantes.find(v => v.id_producto_variante === val);
            return getVarianteName(variante);
          }},
          { key: 'stock', label: 'Stock Actual', render: (val) => val || 0 },
          { key: 'stock_minimo', label: 'Stock Mínimo', render: (val) => val || 0 },
          { key: 'activo', label: 'Estado', render: (val) => (val ? 'Activo' : 'Inactivo') },
          { 
            key: 'acciones', 
            label: 'Acciones', 
            render: (_, row) => (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2 hover:bg-blue-600"
                onClick={() => handleCrearMovimiento(row)}
              >
                Movimiento
              </button>
            )
          },
        ]}
        data={inventarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        loading={loading}
      />

      {/* Modal para Crear/Editar Inventario */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={tipoModal === 'crear' ? 'Nuevo Inventario' : 'Editar Inventario'}
        submitLabel={tipoModal === 'crear' ? 'Crear inventario' : 'Guardar cambios'}
      >
        <FormField label="Variante">
          <select
            value={formData.id_producto_variante}
            onChange={(e) => {
              setFormData({ ...formData, id_producto_variante: e.target.value });
              if (errors.id_producto_variante) setErrors({ ...errors, id_producto_variante: '' });
            }}
            disabled={tipoModal === 'editar'}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.id_producto_variante
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            } ${tipoModal === 'editar' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">Seleccione una variante</option>
            {variantes
              .filter(v => {
                // No mostrar variantes que ya tienen inventario (excepto la que se está editando)
                const tieneInventario = inventarios.some(inv => inv.id_producto_variante === v.id_producto_variante);
                return !tieneInventario || v.id_producto_variante === parseInt(formData.id_producto_variante);
              })
              .map((variante) => (
                <option key={variante.id_producto_variante} value={variante.id_producto_variante}>
                  {getVarianteName(variante)}
                </option>
              ))}
          </select>
          {errors.id_producto_variante && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.id_producto_variante}
            </p>
          )}
        </FormField>

        <FormField
          label="Stock Actual"
          type="number"
          value={formData.stock}
          onChange={(e) => {
            setFormData({ ...formData, stock: e.target.value });
            if (errors.stock) setErrors({ ...errors, stock: '' });
          }}
          error={errors.stock}
          placeholder="0"
        />

        <FormField
          label="Stock Mínimo"
          type="number"
          value={formData.stock_minimo}
          onChange={(e) => {
            setFormData({ ...formData, stock_minimo: e.target.value });
            if (errors.stock_minimo) setErrors({ ...errors, stock_minimo: '' });
          }}
          error={errors.stock_minimo}
          placeholder="0"
        />

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {errors.general}
          </div>
        )}
      </Modal>

      {/* Modal para Movimientos */}
      <Modal
        isOpen={modalMovimiento}
        onClose={handleMovimientoClose}
        onSubmit={handleSubmitMovimiento}
        title="Realizar Movimiento"
        submitLabel="Procesar movimiento"
      >
        <FormField label="Tipo de Movimiento">
          <select
            value={formMovimiento.tipo_movimiento}
            onChange={(e) => setFormMovimiento({ ...formMovimiento, tipo_movimiento: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="ENTRADA">Entrada (Agregar stock)</option>
            <option value="SALIDA">Salida (Restar stock)</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
        </FormField>

        <FormField
          label="Cantidad"
          type="number"
          value={formMovimiento.cantidad}
          onChange={(e) => {
            setFormMovimiento({ ...formMovimiento, cantidad: e.target.value });
            if (erroresMovimiento.cantidad) setErroresMovimiento({ ...erroresMovimiento, cantidad: '' });
          }}
          error={erroresMovimiento.cantidad}
          placeholder="0"
        />

        <FormField
          label="Motivo"
          value={formMovimiento.motivo}
          onChange={(e) => {
            setFormMovimiento({ ...formMovimiento, motivo: e.target.value });
            if (erroresMovimiento.motivo) setErroresMovimiento({ ...erroresMovimiento, motivo: '' });
          }}
          error={erroresMovimiento.motivo}
          placeholder="Ej: Reabastecimiento, Devolución, Corrección de inventario..."
        />

        {erroresMovimiento.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {erroresMovimiento.general}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventarioPage;

