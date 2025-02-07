// src/pages/invoices/InvoicePreview/InvoiceItemsTable.js
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
  } from '@mui/material';
  
  export const InvoiceItemsTable = ({ items = [], moneda = 'USD' }) => (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
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
              <TableCell>{item.product?.codigo}</TableCell>
              <TableCell>{item.product?.nombre}</TableCell>
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
  );

export default InvoiceItemsTable;