// src/pages/documents/components/DocumentActions.js
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';
import { DOCUMENT_STATUS } from '../constants/documentTypes';
import ConvertToInvoiceModal from './ConvertToInvoiceModal';
import DocumentFormModal from './DocumentFormModal';

const DocumentActions = ({
  document,
  onPreview,
  onDelete,
  onConvertToInvoice,
  onRefresh
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const open = Boolean(anchorEl);
  const isConverted = document.status === DOCUMENT_STATUS.CONVERTED;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    action && action();
  };

  const handleEditClick = () => {
    handleClose();
    setShowEditModal(true);
  };

  const handleConvertClick = () => {
    handleClose();
    setShowConvertModal(true);
  };

  // MODIFICADO: Acepta 'invoiceDataFromModal' como parámetro
  const handleConvertConfirm = (invoiceDataFromModal) => {
    setShowConvertModal(false);
    // MODIFICADO: Pasa los datos del modal a onConvertToInvoice
    onConvertToInvoice && onConvertToInvoice(invoiceDataFromModal);
  };

  const handleEditClose = (success) => {
    setShowEditModal(false);
    if (success && onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="Ver">
          <IconButton onClick={() => handleAction(onPreview)} size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Editar">
          <IconButton
            onClick={handleEditClick}
            size="small"
            disabled={isConverted}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Más opciones">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'document-actions-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        id="document-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'document-actions-button',
        }}
      >
        <MenuItem
          onClick={handleConvertClick}
          disabled={isConverted}
        >
          <ListItemIcon>
            <ConvertIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Convertir a Factura</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleAction(onDelete)}
          sx={{ color: 'error.main' }}
          disabled={isConverted}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      <ConvertToInvoiceModal
        open={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConfirm={handleConvertConfirm} // Ahora pasará los datos a la función modificada
        document={document}
      />

      <DocumentFormModal
        open={showEditModal}
        onClose={handleEditClose}
        documentId={document._id}
      />
    </>
  );
};

export default DocumentActions;