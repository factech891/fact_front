// src/pages/documents/components/DocumentActions.js (CORREGIDO - Bypass isConverted para Admin/Manager)
import React, { useState, useEffect } from 'react';
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
import { useRoleAccess } from '../../../hooks/useRoleAccess'; // Ajusta la ruta si es necesario
import ActionButton from '../../../components/ActionButton'; // Ajusta la ruta si es necesario

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

  // Obtener funciones de permiso y el rol del usuario del hook
  const { userRole, canEdit, canDelete } = useRoleAccess();

  const open = Boolean(anchorEl);
  const isConverted = document.status === DOCUMENT_STATUS.CONVERTED;

  // Determinar si el rol actual debe ignorar la restricción de 'isConverted'
  const shouldBypassConvertedRestriction = ['admin', 'manager'].includes(userRole);

  // // *** DEBUGGING - Puedes comentar o eliminar esto ahora ***
  // useEffect(() => {
  //   console.log(`[Debug DocumentActions] Documento ID: ${document?._id}, Número: ${document?.documentNumber}`);
  //   console.log(`[Debug DocumentActions] Rol Detectado: ${userRole}`);
  //   console.log(`[Debug DocumentActions] Permiso canEdit(): ${canEdit()}`);
  //   console.log(`[Debug DocumentActions] Permiso canDelete(): ${canDelete()}`);
  //   console.log(`[Debug DocumentActions] Documento Convertido (isConverted): ${isConverted}`);
  //   console.log(`[Debug DocumentActions] Bypass Restricción Convertido: ${shouldBypassConvertedRestriction}`);
  // }, [document, userRole, canEdit, canDelete, isConverted, shouldBypassConvertedRestriction]);
  // // *** FIN DEBUGGING ***


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
    setShowEditModal(true);
  };

  const handleConvertClick = () => {
    handleClose();
    setShowConvertModal(true);
  };

  const handleConvertConfirm = (invoiceDataFromModal) => {
    setShowConvertModal(false);
    onConvertToInvoice && onConvertToInvoice(invoiceDataFromModal);
  };

  const handleEditClose = (success) => {
    setShowEditModal(false);
    if (success && onRefresh) {
      onRefresh();
    }
  };

  const handleDeleteClick = () => {
    handleClose();
    // onDelete es la función que viene de Documents.js y muestra el diálogo de confirmación
    onDelete && onDelete();
  }

  // Determinar si el botón/opción debe estar deshabilitado
  // Está deshabilitado si isConverted es true Y el rol NO es admin/manager
  const isDisabledDueToConversion = isConverted && !shouldBypassConvertedRestriction;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Botón Ver */}
        <Tooltip title="Ver Detalles">
          <IconButton onClick={() => handleAction(onPreview)} size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Botón Editar: Usar ActionButton */}
        <ActionButton
          type="edit" // Verifica canEdit() internamente
          onClick={handleEditClick}
          tooltipTitle="Editar Documento"
          isIconButton={true}
          showDisabled={true} // Mostrar deshabilitado si no tiene permiso O si está convertido (y no es admin/manager)
          buttonProps={{
            size: 'small',
            // Deshabilitar si está convertido Y el rol NO es admin/manager
            // ActionButton ya maneja el permiso canEdit, solo añadimos esta lógica
            disabled: isDisabledDueToConversion,
          }}
        >
          <EditIcon fontSize="small" />
        </ActionButton>

        {/* Menú Más Opciones: Mostrar solo si puede editar o borrar */}
        { (canEdit() || canDelete()) &&
          <Tooltip title="Más opciones">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'document-actions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              // Deshabilitar el menú si todas las opciones dentro estarán deshabilitadas
              // (es decir, si está convertido y no es admin/manager)
              disabled={isDisabledDueToConversion}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
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
        {/* Opción Convertir: Mostrar si puede editar */}
        {canEdit() && (
          <MenuItem
            onClick={handleConvertClick}
            // Deshabilitar si está convertido Y el rol NO es admin/manager
            disabled={isDisabledDueToConversion}
          >
            <ListItemIcon>
              <ConvertIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Convertir a Factura</ListItemText>
          </MenuItem>
        )}

        {/* Separador: Mostrar si ambas opciones son potencialmente visibles */}
        {canEdit() && canDelete() && <Divider />}

        {/* Opción Eliminar: Mostrar si puede borrar */}
        {canDelete() && (
          <MenuItem
            onClick={handleDeleteClick}
            sx={{ color: 'error.main' }}
            // Deshabilitar si está convertido Y el rol NO es admin/manager
            disabled={isDisabledDueToConversion}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Eliminar</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Modales (sin cambios) */}
      <ConvertToInvoiceModal
        open={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConfirm={handleConvertConfirm}
        document={document}
      />

      <DocumentFormModal
        open={showEditModal}
        onClose={handleEditClose}
        documentId={document?._id}
        isEditMode={true}
      />
    </>
  );
};

export default DocumentActions;