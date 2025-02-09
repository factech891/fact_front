// src/pages/invoices/InvoicePreview/InvoiceItemsTable.js
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';

const styles = {
  tableContainer: {
    marginBottom: '30px',
    border: '1px solid #e0e0e7',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tableHeader: {
    backgroundColor: '#002855',
    color: 'white',
    fontSize: '12px',
    padding: '12px',
    fontWeight: '600'
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f8f9fa'
    }
  },
  tableCell: {
    fontSize: '12px',
    padding: '10px 12px',
    color: '#2c3e50'
  },
  numericCell: {
    fontSize: '12px',
    padding: '10px 12px',
    color: '#2c3e50',
    fontFamily: 'monospace'
  }
};

export const InvoiceItemsTable = ({ items = [], moneda = 'USD' }) => {
  if (!items || items.length === 0) return null;

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  return (
    <TableContainer sx={styles.tableContainer}>
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
                {item.product?.codigo || item.codigo || ''}
              </TableCell>
              <TableCell sx={styles.tableCell}>
                {item.product?.nombre || item.descripcion || ''}
              </TableCell>
              <TableCell align="right" sx={styles.numericCell}>
                {formatNumber(item.quantity)}
              </TableCell>
              <TableCell align="right" sx={styles.numericCell}>
                {moneda} {formatNumber(item.price)}
              </TableCell>
              <TableCell align="right" sx={styles.numericCell}>
                {moneda} {formatNumber(item.quantity * item.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceItemsTable;