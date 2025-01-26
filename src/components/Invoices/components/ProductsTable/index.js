// components/ProductsTable/index.js
import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, TextField, Select, MenuItem
} from '@mui/material';
import { styles } from './styles';

const ProductsTable = ({ items, onItemChange }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Unit.</TableCell>
                        <TableCell>Exento</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>IVA (16%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.codigo}</TableCell>
                            <TableCell>{item.descripcion}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(e) => onItemChange(index, 'cantidad', parseFloat(e.target.value))}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={item.precioUnitario}
                                    onChange={(e) => onItemChange(index, 'precioUnitario', parseFloat(e.target.value))}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={item.exento}
                                    onChange={(e) => onItemChange(index, 'exento', e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value={false}>No</MenuItem>
                                    <MenuItem value={true}>Sí</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>{item.subtotal}</TableCell>
                            <TableCell>{item.exento ? 0 : (item.subtotal * 0.16).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductsTable;