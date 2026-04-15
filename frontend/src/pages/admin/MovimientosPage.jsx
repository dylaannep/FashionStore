import React, { useEffect, useState } from 'react';
import { movimientosService, variantesService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_producto_variante: '',
    tipo_movimiento: 'ENTRADA',
    cantidad: '',
    motivo: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMovimientos();
    fetchVariantes();
  }, []);

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const response = await movimientosService.getAll();
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error fetching movimientos:', error);
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

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      id_producto_variante: '',
      tipo_movimiento: 'ENTRADA',
      cantidad: '',
      motivo: '',
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors = {};
    if (!formData.id_producto_variante) newErrors.id_producto_variante = 'Debe seleccionar una variante.';
    if (!formData.tipo_movimiento) newErrors.tipo_movimiento = 'Debe seleccionar un tipo de movimiento.';
    if (!formData.cantidad) newErrors.cantidad = 'La cantidad es obligatoria.';
    else if (isNaN(formData.cantidad) || parseInt(formData.cantidad) <= 0) newErrors.cantidad = 'La cantidad debe ser un número mayor a 0.';
    if (!formData.motivo.trim()) newErrors.motivo = 'El motivo es obligatorio.';
    else if (formData.motivo.length > 200) newErrors.motivo = 'El motivo no puede exceder 200 caracteres.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      id_producto_variante: parseInt(formData.id_producto_variante),
      tipo_movimiento: formData.tipo_movimiento,
      cantidad: parseInt(formData.cantidad),
      motivo: formData.motivo,
    };

    try {
      await movimientosService.create(dataToSend);
      fetchMovimientos();
      handleModalClose();
    } catch (error) {
      const mensaje = error?.response?.data?.error || '';
      const backendErrors = {};

      if (mensaje.toLowerCase().includes('variante')) {
        backendErrors.id_producto_variante = mensaje;
      } else if (mensaje.toLowerCase().includes('stock')) {
        backendErrors.cantidad = mensaje;
      } else if (mensaje.toLowerCase().includes('cantidad')) {
        backendErrors.cantidad = mensaje;
      } else if (mensaje.toLowerCase().includes('tipo')) {
        backendErrors.tipo_movimiento = mensaje;
      } else {
        backendErrors.general = mensaje || 'Ocurrió un error al guardar. Intenta de nuevo.';
      }

      setErrors(backendErrors);
    }
  };

  const getVarianteName = (varianteId) => {
    const variante = variantes.find(v => v.id_producto_variante === varianteId);
    return variante ? `${variante.sku}` : '—';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movimientos de Inventario</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setFormData({
            id_producto_variante: '',
            tipo_movimiento: 'ENTRADA',
            cantidad: '',
            motivo: '',
          });
          setErrors({});
          setModalOpen(true);
        }}
      >
        Nuevo Movimiento
      </button>
      <DataTable
        columns={[
          { key: 'id_producto_variante', label: 'Variante (SKU)', render: (val) => getVarianteName(val) },
          { key: 'tipo_movimiento', label: 'Tipo', render: (val) => {
            const tipos = { 'ENTRADA': 'Entrada', 'SALIDA': 'Salida', 'AJUSTE': 'Ajuste' };
            return tipos[val] || val;
          }},
          { key: 'cantidad', label: 'Cantidad' },
          { key: 'motivo', label: 'Motivo' },
          { key: 'fecha_movimiento', label: 'Fecha', render: (val) => {
            if (!val) return '—';
            const fecha = new Date(val);
            return fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          }},
        ]}
        data={movimientos}
        loading={loading}
        onEdit={null}
        onDelete={null}
        onToggleActive={null}
        hideActions={true}
      />
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title="Nuevo Movimiento"
        submitLabel="Procesar Movimiento"
      >
        <FormField label="Variante (SKU)">
          <select
            value={formData.id_producto_variante}
            onChange={(e) => {
              setFormData({ ...formData, id_producto_variante: e.target.value });
              if (errors.id_producto_variante) setErrors({ ...errors, id_producto_variante: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.id_producto_variante
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="">Seleccione una variante</option>
            {variantes.map((variante) => (
              <option key={variante.id_producto_variante} value={variante.id_producto_variante}>
                {variante.sku}
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

        <FormField label="Tipo de Movimiento">
          <select
            value={formData.tipo_movimiento}
            onChange={(e) => {
              setFormData({ ...formData, tipo_movimiento: e.target.value });
              if (errors.tipo_movimiento) setErrors({ ...errors, tipo_movimiento: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.tipo_movimiento
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
          {errors.tipo_movimiento && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.tipo_movimiento}
            </p>
          )}
        </FormField>

        <FormField
          label="Cantidad"
          type="number"
          value={formData.cantidad}
          onChange={(e) => {
            setFormData({ ...formData, cantidad: e.target.value });
            if (errors.cantidad) setErrors({ ...errors, cantidad: '' });
          }}
          error={errors.cantidad}
          placeholder="0"
        />

        <FormField
          label="Motivo"
          value={formData.motivo}
          onChange={(e) => {
            setFormData({ ...formData, motivo: e.target.value });
            if (errors.motivo) setErrors({ ...errors, motivo: '' });
          }}
          error={errors.motivo}
          placeholder="Ej: Entrada de compra, Devolución de cliente, etc."
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
    </div>
  );
};

export default MovimientosPage;
