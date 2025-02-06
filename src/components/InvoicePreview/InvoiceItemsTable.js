// InvoiceItemsTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const styles = {
 tableHeader: {
     backgroundColor: '#002855',
     color: 'white',
     fontSize: '10px',
     padding: '10px'
 },
 tableRow: {
     '&:nth-of-type(odd)': {
         backgroundColor: '#f8f9fa'
     }
 },
 tableCell: {
     fontSize: '10px',
     padding: '7px 10px'
 }
};

const InvoiceItemsTable = ({ items, moneda = 'USD' }) => (
 <TableContainer>
     <Table>
         <TableHead>
             <TableRow>
                 <TableCell sx={styles.tableHeader}>Código</TableCell>
                 <TableCell sx={styles.tableHeader}>Descripción</TableCell>
                 <TableCell align="right" sx={styles.tableHeader}>Cantidad</TableCell>
                 <TableCell align="right" sx={styles.tableHeader}>Precio Unit.</TableCell>
                 <TableCell align="right" sx={styles.tableHeader}>Total</TableCell>
             </TableRow>
         </TableHead>
         <TableBody>
             {items.map((item, index) => (
                 <TableRow key={index} sx={styles.tableRow}>
                     <TableCell sx={styles.tableCell}>
                         {item.product?.codigo}
                     </TableCell>
                     <TableCell sx={styles.tableCell}>
                         {item.product?.nombre}
                     </TableCell>
                     <TableCell align="right" sx={styles.tableCell}>
                         {item.quantity}
                     </TableCell>
                     <TableCell align="right" sx={styles.tableCell}>
                         {moneda} {item.price?.toFixed(2)}
                     </TableCell>
                     <TableCell align="right" sx={styles.tableCell}>
                         {moneda} {(item.quantity * item.price).toFixed(2)}
                     </TableCell>
                 </TableRow>
             ))}
         </TableBody>
     </Table>
 </TableContainer>
);

export default InvoiceItemsTable;