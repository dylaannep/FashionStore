import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineEdit as Edit } from 'react-icons/ai';
import { AiOutlinePoweroff as Power } from 'react-icons/ai';

const DataTable = ({ columns, data, onEdit, onToggleActive, loading }) => {
  if (loading) {
    return <div className="text-acento">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="text-gris">Sin resultados</div>;
  }

  return (
    <table className="w-full bg-white border border-borde rounded-lg">
      <thead className="bg-sidebar text-white">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 text-left text-sm font-medium">{col.label}</th>
          ))}
          <th className="px-4 py-2 text-left text-sm font-medium">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-100">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 text-sm text-primario">{row[col.key]}</td>
            ))}
            <td className="px-4 py-2 flex gap-2">
              <button onClick={() => onEdit(row)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-acento bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Edit size={13}/> Editar
              </button>
              <button onClick={() => onToggleActive(row)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-warning bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                <Power size={13}/> {row.activo ? 'Inactivar' : 'Activar'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onToggleActive: PropTypes.func,
  loading: PropTypes.bool,
};

DataTable.defaultProps = {
  onEdit: () => {},
  onToggleActive: () => {},
  loading: false,
};

export default DataTable;
