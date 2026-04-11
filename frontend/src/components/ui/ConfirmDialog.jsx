import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-borde">
        <div className="flex flex-col items-center text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-warning mb-4" />
          <p className="text-primario text-lg font-medium mb-4">{message}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-primario px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-error hover:bg-error/90 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            onClick={onConfirm}
          >
            Confirmar
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
