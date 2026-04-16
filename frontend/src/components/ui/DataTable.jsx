import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Chip, Button } from '@material-tailwind/react';
import { PencilIcon, PowerIcon } from '@heroicons/react/24/outline';

const DataTable = ({
  columns,
  data,
  onEdit = null,
  onToggleActive = null,
  onDelete = null,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="loader" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Typography variant="h6" color="blue-gray">
          No hay datos disponibles
        </Typography>
      </div>
    );
  }

  return (
    <Card className="h-full w-full overflow-scroll shadow-sm border border-blue-gray-100">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold uppercase"
                >
                  {column.label}
                </Typography>
              </th>
            ))}
            {(onEdit || onToggleActive || onDelete) && (
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold uppercase"
                >
                  Acciones
                </Typography>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`even:bg-blue-gray-50/30 hover:bg-blue-gray-50/50`}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-4">
                  {column.render
                    ? column.render(row[column.key], row)
                    : column.key === 'activo'
                    ? row[column.key] ? (
                        <Chip color="green" value="Activo" />
                      ) : (
                        <Chip color="red" value="Inactivo" />
                      )
                    : typeof row[column.key] === 'object' && row[column.key] !== null
                    ? JSON.stringify(row[column.key])
                    : row[column.key]}
                </td>
              ))}
              {(onEdit || onToggleActive || onDelete) && (
                <td className="p-4 flex gap-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="text"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => onEdit(row)}
                    >
                      <PencilIcon className="h-5 w-5" />
                      Editar
                    </Button>
                  )}
                  {onToggleActive && row.activo !== undefined && (
                    <Button
                      size="sm"
                      variant="text"
                      className={
                        row.activo
                          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }
                      onClick={() => onToggleActive(row)}
                    >
                      <PowerIcon className="h-5 w-5" />
                      {row.activo ? "Inactivar" : "Activar"}
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
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
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
};

export default DataTable;
