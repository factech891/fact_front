import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';  // Importar los íconos

function ClientTable({ clients, onEdit, onDelete }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => onEdit(client)}
                                    sx={{ color: 'var(--icon-edit)' }}  // Usar variable de global.css
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDelete(client.id)}
                                    sx={{ color: 'var(--icon-delete)' }}  // Usar variable de global.css
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