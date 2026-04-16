import React from "react";
import PropTypes from "prop-types";
import {
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";

const FormField = ({
  label,
  error,
  children,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  required,
}) => {
  const renderInput = () => {
    if (children) return children;

    switch (type) {
      case "select":
        return (
          <select
            value={value || ''}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {options && options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full"
            labelProps={{ className: "hidden" }}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={onChange}
              className="cursor-pointer"
            />
            <Typography variant="small" color="blue-gray">
              {value ? "Activo" : "Inactivo"}
            </Typography>
          </div>
        );
      default:
        return (
          <Input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            size="lg"
            color="blue"
            labelProps={{ className: "hidden" }}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-primario mb-1.5">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {renderInput()}
      {error && (
        <Typography color="red" variant="small" className="mt-1">
          {error}
        </Typography>
      )}
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  required: PropTypes.bool,
};

export default FormField;
