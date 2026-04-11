import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'react-icons/fi';

const PageHeader = ({ title, subtitle, onAdd, addLabel }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-primario font-bold text-2xl">{title}</h1>
          {subtitle && <p className="text-gris text-sm mt-1">{subtitle}</p>}
        </div>
        {onAdd && (
          <button
            className="bg-acento text-white font-semibold rounded-lg px-4 py-2 hover:bg-acentoHover transition-colors inline-flex items-center gap-2"
            onClick={onAdd}
          >
            <Plus size={16} /> {addLabel || 'Nuevo'}
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
