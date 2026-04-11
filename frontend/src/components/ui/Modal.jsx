import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineClose as Close } from 'react-icons/ai';

const Modal = ({ isOpen, onClose, title, children, size }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-secundario rounded-xl shadow-2xl w-full ${sizeClasses[size]} border border-borde`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-borde">
          <h2 className="text-lg font-semibold text-primario">{title}</h2>
          <button onClick={onClose} className="text-gris hover:text-primario hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
            <Close size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

Modal.defaultProps = {
  size: 'md',
};

export default Modal;
