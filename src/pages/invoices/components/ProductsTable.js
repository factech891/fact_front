import React from 'react';
// src/pages/invoices/ProductsTable.js
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card
  } from '@mui/material';
  
  export const ProductsTable = ({ items = [], moneda = 'USD' }) => {
    return (
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio Unit.</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">IVA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product?.codigo || item.codigo}</TableCell>
                  <TableCell>{item.product?.nombre || item.descripcion}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {moneda} {item.price?.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {moneda} {(item.quantity * item.price)?.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {moneda} {(item.quantity * item.price * 0.16)?.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  };