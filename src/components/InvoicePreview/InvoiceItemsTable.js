// InvoiceItemsTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const styles = {
  tableHeader: {
      backgroundColor: '#002855',
      color: 'white'
  },
  tableRow: {
      '&:nth-of-type(odd)': {
          backgroundColor: '#F8F9FA'
      }
  }
};

const InvoiceItemsTable = ({ items, moneda = 'USD' }) => (
  <TableContainer>
      <Table>
          <TableHead>
              <TableRow>
                  <TableCell sx={styles.tableHeader}>Código</TableCell>
                  <TableCell sx={styles.tableHeader}>Descripción</TableCell>
                  <TableCell align="center" sx={styles.tableHeader}>Cantidad</TableCell>
                  <TableCell align="right" sx={styles.tableHeader}>Precio Unit.</TableCell>
                  <TableCell align="center" sx={styles.tableHeader}>Exento</TableCell>
                  <TableCell align="right" sx={styles.tableHeader}>IVA (16%)</TableCell>
                  <TableCell align="right" sx={styles.tableHeader}>Subtotal</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
              {items.map((item, index) => (
                  <TableRow key={index} sx={styles.tableRow}>
                      <TableCell>{item.codigo}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell align="center">{item.cantidad}</TableCell>
                      <TableCell align="right">{moneda} {item.precioUnitario?.toFixed(2)}</TableCell>
                      <TableCell align="center">{item.exento ? 'Sí' : 'No'}</TableCell>
                      <TableCell align="right">
                          {item.exento ? '-' : `${moneda} ${(item.subtotal * 0.16).toFixed(2)}`}
                      </TableCell>
                      <TableCell align="right">{moneda} {item.subtotal?.toFixed(2)}</TableCell>
                  </TableRow>
              ))}
          </TableBody>
      </Table>
  </TableContainer>
);

export default InvoiceItemsTable;