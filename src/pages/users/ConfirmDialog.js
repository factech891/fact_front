// src/pages/users/ConfirmDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'error',
  onConfirm,
  onCancel
}) => {
  // Estilo para botones de acción (si se necesita un botón especial)
  const actionButtonStyle = {
    borderRadius: '50px',
    fontWeight: 600,
    padding: '6px 16px',
    textTransform: 'none',
    fontSize: '14px'
  };
  
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: { 
          backgroundColor: '#2a2a2a', 
          color: 'white',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 1.5
      }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button 
          onClick={onCancel} 
          sx={{
            ...actionButtonStyle,
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={confirmColor}
          variant="contained"
          sx={{
            ...actionButtonStyle,
            '&.MuiButton-containedError': {
              backgroundImage: confirmColor === 'error' ? 
                'linear-gradient(to right, #ff416c, #ff4b2b)' : 
                undefined,
              boxShadow: confirmColor === 'error' ? 
                '0 4px 15px rgba(255, 75, 43, 0.4)' : 
                undefined
            }
          }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;