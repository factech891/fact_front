import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  ContentCopy as DuplicateIcon,
  PictureAsPdf as PdfIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';
import { DOCUMENT_STATUS } from '../constants/documentTypes';
import ConvertToInvoiceModal from './ConvertToInvoiceModal';

const DocumentActions = ({ 
  document, 
  onEdit, 
  onPreview, 
  onDelete, 
  onSend, 
  onDuplicate, 
  onDownloadPdf, 
  onConvertToInvoice 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  
  const open = Boolean(anchorEl);
  
  // Check if document is already converted to invoice
  const isConverted = document.status === DOCUMENT_STATUS.CONVERTED;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    action();
  };

  const handleConvertClick = () => {
    handleClose();
    setShowConvertModal(true);
  };

  const handleConvertConfirm = () => {
    setShowConvertModal(false);
    onConvertToInvoice && onConvertToInvoice(document._id);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="Ver">
          <IconButton onClick={onPreview} size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Editar">
          <IconButton 
            onClick={onEdit} 
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
        <MenuItem onClick={() => handleAction(onSend)} disabled={isConverted}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleAction(onDownloadPdf)}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar PDF</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleAction(onDuplicate)}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicar</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={handleConvertClick} 
          disabled={isConverted}
        >
          <ListItemIcon>
            <ConvertIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Convertir a Factura</ListItemText>
        </MenuItem>
        
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
        onConfirm={handleConvertConfirm}
        document={document}
      />
    </>
  );
};

export default DocumentActions;