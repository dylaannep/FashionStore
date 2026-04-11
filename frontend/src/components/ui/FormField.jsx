import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ label, error, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-primario font-medium mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-error text-sm mt-1 flex items-center">
          <span className="material-icons mr-1">error</span>
          {error}
        </p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FormField.defaultProps = {
  error: null,
};

export default FormField;
