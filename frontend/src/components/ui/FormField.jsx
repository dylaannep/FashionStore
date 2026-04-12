import React from "react";
import PropTypes from "prop-types";
import {
  Input,
  Select,
  Option,
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
          <Select
            value={value}
            onChange={(val) => onChange({ target: { value: val } })}
            labelProps={{ className: "hidden" }}
            className="w-full"
          >
            <Option value="">Seleccionar...</Option>
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
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
