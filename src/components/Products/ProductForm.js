import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function ProductForm({ open, onClose, product, onSave }) {
   const [formData, setFormData] = useState({
       _id: '', // Agregamos el campo _id
       nombre: '',
       precio: '',
       codigo: `P${Math.random().toString(36).substr(2, 3).toUpperCase()}` // Genera un código predeterminado
   });

   const [errors, setErrors] = useState({});

   useEffect(() => {
       if (product) {
           setFormData({
               _id: product._id || '', // Asignamos el _id si existe
               nombre: product.nombre || '',
               precio: (product.precio || '').toString(),
               codigo: product.codigo || formData.codigo // Usa el código existente o genera uno nuevo
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
               _id: formData._id, // Incluimos el _id en los datos a guardar
               nombre: formData.nombre,
               precio: parseFloat(formData.precio),
               codigo: formData.codigo // Aseguramos que el código esté incluido
           });
           handleClose();
       }
   };

   const handleClose = () => {
       setFormData({
           _id: '', // Reiniciamos el _id
           nombre: '',
           precio: '',
           codigo: `P${Math.random().toString(36).substr(2, 3).toUpperCase()}` // Generamos un nuevo código
       });
       setErrors({});
       onClose();
   };

   return (
       <Dialog open={open} onClose={handleClose}>
           <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
           <DialogContent>
               {/* Campo oculto para el _id */}
               <TextField
                   margin="dense"
                   label="ID"
                   fullWidth
                   value={formData._id}
                   InputProps={{
                       readOnly: true,
                   }}
                   sx={{ display: 'none' }} // Ocultamos este campo visualmente
               />
               <TextField
                   margin="dense"
                   label="Código"
                   fullWidth
                   value={formData.codigo}
                   InputProps={{
                       readOnly: true, // Hacemos el código de solo lectura
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