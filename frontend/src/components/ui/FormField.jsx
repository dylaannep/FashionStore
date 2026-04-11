import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineWarning as Warning } from 'react-icons/ai';

const FormField = ({ label, error, children, type, value, onChange, placeholder, options, required }) => {
  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-borde bg-white text-primario \
                      placeholder-gris focus:outline-none focus:ring-2 focus:ring-acento/30 \
                      focus:border-acento transition-colors text-sm";

  const renderInput = () => {
    if (children) return children;
    if (type === 'select') return (
      <select value={value} onChange={onChange} className={inputClass}>
        <option value="">Seleccionar...</option>
        {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    );
    if (type === 'textarea') return (
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} className={inputClass} />
    );
    if (type === 'checkbox') return (
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={value} onChange={onChange} 
               className="w-4 h-4 rounded border-borde text-acento focus:ring-acento" />
        <span className="text-sm text-gris">Activo</span>
      </div>
    );
    return <input type={type || 'text'} value={value} onChange={onChange} 
                  placeholder={placeholder} required={required} className={inputClass} />;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-primario mb-1.5">{label}</label>
      {renderInput()}
      {error && <p className="text-error text-xs mt-1.5 flex items-center gap-1"><Warning size={12}/>{error}</p>}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  required: PropTypes.bool,
};

export default FormField;
