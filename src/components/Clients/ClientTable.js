import React from 'react';
import { 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
   Paper, IconButton 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function ClientTable({ clients, onEdit, onDelete }) {
   return (
       <TableContainer component={Paper}>
           <Table>
               <TableHead>
                   <TableRow>
                       <TableCell>Nombre</TableCell>
                       <TableCell>RIF</TableCell>
                       <TableCell>Email</TableCell>
                       <TableCell>Teléfono</TableCell>
                       <TableCell>Dirección</TableCell>
                       <TableCell>Acciones</TableCell>
                   </TableRow>
               </TableHead>
               <TableBody>
                   {clients.map((client) => (
                       <TableRow key={client.id}>
                           <TableCell>{client.nombre || 'N/A'}</TableCell>
                           <TableCell>{client.rif || 'N/A'}</TableCell>
                           <TableCell>{client.email || 'N/A'}</TableCell>
                           <TableCell>{client.telefono || 'N/A'}</TableCell>
                           <TableCell>{client.direccion || 'N/A'}</TableCell>
                           <TableCell>
                               <IconButton
                                   onClick={() => onEdit(client)}
                                   sx={{ color: 'var(--icon-edit)' }}
                               >
                                   <Edit />
                               </IconButton>
                               <IconButton
                                   onClick={() => onDelete(client.id)}
                                   sx={{ color: 'var(--icon-delete)' }}
                               >
                                   <Delete />
                               </IconButton>
                           </TableCell>
                       </TableRow>
                   ))}
               </TableBody>
           </Table>
       </TableContainer>
   );
}

export default ClientTable;