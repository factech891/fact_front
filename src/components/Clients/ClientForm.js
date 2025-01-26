import React, { useState, useEffect } from 'react';
import { 
   TextField, 
   Dialog, 
   DialogTitle, 
   DialogContent, 
   DialogActions, 
   Button 
} from '@mui/material';

function ClientForm({ open, onClose, client, onSave }) {
   const [formData, setFormData] = useState({
       nombre: '',
       email: '',
       rif: '',
       direccion: '',
       telefono: ''
   });
   const [errors, setErrors] = useState({});

   useEffect(() => {
       if (client) {
           setFormData({
               nombre: client.nombre || '',
               email: client.email || '',
               rif: client.rif || '',
               direccion: client.direccion || '',
               telefono: client.telefono || ''
           });
       }
   }, [client]);

   const validateForm = () => {
       const newErrors = {};
       if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
       if (!formData.rif.trim()) newErrors.rif = 'El RIF es requerido';
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
   };

   const handleSave = () => {
       if (validateForm()) {
           onSave({
               ...client,
               ...formData
           });
           handleClose();
       }
   };

   const handleClose = () => {
       setFormData({
           nombre: '',
           email: '',
           rif: '',
           direccion: '',
           telefono: ''
       });
       setErrors({});
       onClose();
   };

   return (
       <Dialog open={open} onClose={handleClose}>
           <DialogTitle>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
           <DialogContent>
               <TextField
                   autoFocus
                   margin="dense"
                   label="Nombre"
                   fullWidth
                   value={formData.nombre}
                   onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                   error={!!errors.nombre}
                   helperText={errors.nombre}
               />
               <TextField
                   margin="dense"
                   label="RIF"
                   fullWidth
                   value={formData.rif}
                   onChange={(e) => setFormData(prev => ({...prev, rif: e.target.value}))}
                   error={!!errors.rif}
                   helperText={errors.rif}
               />
               <TextField
                   margin="dense"
                   label="Dirección"
                   fullWidth
                   value={formData.direccion}
                   onChange={(e) => setFormData(prev => ({...prev, direccion: e.target.value}))}
               />
               <TextField
                   margin="dense"
                   label="Teléfono"
                   fullWidth
                   value={formData.telefono}
                   onChange={(e) => setFormData(prev => ({...prev, telefono: e.target.value}))}
               />
               <TextField
                   margin="dense"
                   label="Email"
                   fullWidth
                   value={formData.email}
                   onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
               />
           </DialogContent>
           <DialogActions>
               <Button onClick={handleClose}>Cancelar</Button>
               <Button 
                   onClick={handleSave} 
                   variant="contained"
                   sx={{
                       backgroundColor: 'var(--primary-color)',
                       color: '#fff',
                       '&:hover': {
                           backgroundColor: 'var(--secondary-color)',
                       },
                   }}
               >
                   Guardar
               </Button>
           </DialogActions>
       </Dialog>
   );
}

export default ClientForm;