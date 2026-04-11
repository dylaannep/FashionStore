import React from 'react';
import PropTypes from 'prop-types';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-secundario text-primario rounded shadow-lg p-4 max-w-sm w-full">
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-error text-fondo px-4 py-2 rounded hover:bg-error/80"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-gris text-primario px-4 py-2 rounded hover:bg-gris/80"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmDialog;
