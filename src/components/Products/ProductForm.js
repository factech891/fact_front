import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function ProductForm({ open, onClose, product, onSave }) {
   const [formData, setFormData] = useState({
       _id: '',
       nombre: '',
       precio: '',
       codigo: `P${Math.random().toString(36).substr(2, 3).toUpperCase()}`
   });

   const [errors, setErrors] = useState({});

   useEffect(() => {
       if (product) {
           setFormData({
               _id: product._id || '',
               nombre: product.nombre || '',
               precio: (product.precio || '').toString(),
               codigo: product.codigo || formData.codigo
           });
       }
   }, [product]);

   const validateForm = () => {
       const newErrors = {};
       if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
       if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
           newErrors.precio = 'Ingrese un precio válido';
       }
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
   };

   const handleSave = () => {
       if (validateForm()) {
           try {
               onSave({
                   _id: formData._id,
                   nombre: formData.nombre,
                   precio: parseFloat(formData.precio),
                   ...((!formData._id) && { codigo: formData.codigo })
               });
               handleClose();
           } catch (error) {
               console.error('Error al guardar:', error);
           }
       }
   };

   const handleClose = () => {
       setFormData({
           _id: '',
           nombre: '',
           precio: '',
           codigo: `P${Math.random().toString(36).substr(2, 3).toUpperCase()}`
       });
       setErrors({});
       onClose();
   };

   return (
       <Dialog open={open} onClose={handleClose}>
           <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
           <DialogContent>
               <TextField
                   margin="dense"
                   label="Código"
                   fullWidth
                   value={formData.codigo}
                   InputProps={{
                       readOnly: true,
                   }}
               />
               <TextField
                   autoFocus
                   margin="dense"
                   label="Nombre del Producto"
                   fullWidth
                   value={formData.nombre}
                   onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                   error={!!errors.nombre}
                   helperText={errors.nombre}
               />
               <TextField
                   margin="dense"
                   label="Precio"
                   type="number"
                   fullWidth
                   value={formData.precio}
                   onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                   error={!!errors.precio}
                   helperText={errors.precio}
               />
           </DialogContent>
           <DialogActions>
               <Button onClick={handleClose}>Cancelar</Button>
               <Button onClick={handleSave} sx={{
                   backgroundColor: 'var(--primary-color)',
                   color: '#fff',
                   '&:hover': {
                       backgroundColor: 'var(--secondary-color)',
                   },
               }}>
                   Guardar
               </Button>
           </DialogActions>
       </Dialog>
   );
}

export default ProductForm;