import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ activo, tipo }) => {
  const colors = {
    activo: 'bg-exito text-fondo',
    inactivo: 'bg-error text-fondo',
    pendiente: 'bg-gris text-primario',
    confirmado: 'bg-acento text-fondo',
    enviado: 'bg-acento2 text-fondo',
    entregado: 'bg-exito text-fondo',
    cancelado: 'bg-error text-fondo',
  };

  const colorClass = activo !== undefined
    ? activo
      ? colors.activo
      : colors.inactivo
    : colors[tipo.toLowerCase()] || 'bg-gris text-primario';

  return (
    <span className={`px-2 py-1 rounded text-sm font-semibold ${colorClass}`}>
      {activo !== undefined ? (activo ? 'Activo' : 'Inactivo') : tipo}
    </span>
  );
};

Badge.propTypes = {
  activo: PropTypes.bool,
  tipo: PropTypes.string,
};

Badge.defaultProps = {
  activo: undefined,
  tipo: '',
};

export default Badge;
