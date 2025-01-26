import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button
} from '@mui/material';

function ProductForm({ open, onClose, product, onSave }) {
   const [formData, setFormData] = useState({
       nombre: '',
       precio: '',
       codigo: `P${Math.random().toString(36).substr(2, 3).toUpperCase()}`
   });
   const [errors, setErrors] = useState({});

   useEffect(() => {
       if (product) {
           setFormData({
               nombre: product.name || product.nombre || '',
               precio: (product.price || product.precio)?.toString() || '',
               codigo: product.codigo || formData.codigo
           });
       }
   }, [product]);

   const validateForm = () => {
       const newErrors = {};
       if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del producto es requerido';
       if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
           newErrors.precio = 'Ingrese un precio válido';
       }
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
   };

   const handleSave = () => {
       if (validateForm()) {
           onSave({
               ...product,
               nombre: formData.nombre,
               precio: parseFloat(formData.precio),
               codigo: formData.codigo
           });
           handleClose();
       }
   };

   const handleClose = () => {
       setFormData({
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
               <Button
                   onClick={handleSave}
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

export default ProductForm;