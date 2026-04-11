import React from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ columns, data, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-acento">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="text-gris">Sin resultados</div>;
  }

  return (
    <table className="w-full bg-secundario text-primario rounded-md">
      <thead>
        <tr className="bg-fondo">
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 text-left">{col.label}</th>
          ))}
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-secundario/50">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
            <td className="px-4 py-2 flex gap-2">
              <button
                className="text-acento hover:underline"
                onClick={() => onEdit(row)}
              >
                Editar
              </button>
              <button
                className="text-error hover:underline"
                onClick={() => onDelete(row)}
              >
                Eliminar
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
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
};

DataTable.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  loading: false,
};

export default DataTable;
