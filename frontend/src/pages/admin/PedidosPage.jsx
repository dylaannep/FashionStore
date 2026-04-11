import React, { useEffect, useState } from 'react';
import { pedidosService, usuariosService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ usuario: '', total: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPedidos();
    fetchUsuarios();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await pedidosService.getAll();
      setPedidos(response.data);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await usuariosService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleEdit = (pedido) => {
    setFormData({ usuario: pedido.usuario, total: pedido.total });
    setEditingId(pedido.id);
    setModalOpen(true);
  };

  const handleDelete = async (pedido) => {
    if (window.confirm(`¿Estás seguro de eliminar el pedido del usuario "${usuarios.find(u => u.id === pedido.usuario)?.nombre}"?`)) {
      try {
        await pedidosService.delete(pedido.id);
        fetchPedidos();
      } catch (error) {
        console.error('Error deleting pedido:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await pedidosService.update(editingId, formData);
      } else {
        await pedidosService.create(formData);
      }
      fetchPedidos();
      setModalOpen(false);
      setFormData({ usuario: '', total: 0 });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving pedido:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nuevo Pedido
      </button>
      <DataTable
        columns={[
          { key: 'usuario', label: 'Usuario', render: (usuarioId) => usuarios.find(u => u.id === usuarioId)?.nombre || 'N/A' },
          { key: 'total', label: 'Total' },
        ]}
        data={pedidos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Pedido' : 'Nuevo Pedido'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Usuario"
            type="select"
            options={usuarios.map(u => ({ value: u.id, label: u.nombre }))}
            value={formData.usuario}
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
          />
          <FormField
            label="Total"
            type="number"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) })}
          />
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PedidosPage;
