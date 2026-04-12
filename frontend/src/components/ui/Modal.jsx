import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, onSubmit, title, children, size, submitLabel }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto'; // Restaurar scroll al desmontar
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog
      size={size}
      open={isOpen}
      handler={onClose}
      className="p-4"
      role="dialog" // Usar role adecuado para accesibilidad
      aria-modal="true" // Indicar que es un modal
    >
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          {title}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={onClose}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6">{children}</DialogBody>
      <DialogFooter>
        <Button className="mr-2" onClick={onClose} variant="outlined" color="red">
          Cancelar
        </Button>
        <Button onClick={onSubmit} variant="gradient" color="blue">
          {submitLabel || 'Guardar'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  submitLabel: PropTypes.string,
};

Modal.defaultProps = {
  size: 'md',
  submitLabel: 'Guardar',
};

export default Modal;
