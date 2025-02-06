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
import { Edit, Delete } from '@mui/icons-material';

function ProductTable({ products, onEdit, onDelete }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>{product.codigo}</TableCell>
                            <TableCell>{product.nombre}</TableCell>
                            <TableCell>${product.precio.toFixed(2)}</TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => onEdit(product)}
                                    sx={{ color: 'var(--icon-edit)' }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDelete(product._id)}
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

export default ProductTable;