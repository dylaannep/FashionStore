import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, onAdd, addLabel }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-acento font-bold text-2xl">{title}</h1>
          {subtitle && <p className="text-gris text-sm mt-1">{subtitle}</p>}
        </div>
        {onAdd && (
          <button
            className="bg-acento text-fondo font-semibold rounded px-4 py-2 hover:bg-acento2 transition"
            onClick={onAdd}
          >
            {addLabel || 'Nuevo'}
          </button>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onAdd: PropTypes.func,
  addLabel: PropTypes.string,
};

PageHeader.defaultProps = {
  subtitle: '',
  onAdd: null,
  addLabel: 'Nuevo',
};

export default PageHeader;
