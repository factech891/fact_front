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
    marginBottom: '20px',
    border: '1px solid #e0e0e7',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  tableHeader: {
    backgroundColor: '#002855',
    color: 'white',
    fontSize: '12px',
    padding: '10px 16px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #002855 0%, #004a9f 100%)',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f8f9fa'
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#ffffff'
    }
  },
  tableCell: {
    fontSize: '12px',
    padding: '8px 16px',
    color: '#2c3e50',
    borderBottom: '1px solid #f0f0f0'
  },
  numericCell: {
    fontSize: '12px',
    padding: '8px 16px',
    color: '#2c3e50',
    fontFamily: 'monospace',
    borderBottom: '1px solid #f0f0f0'
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
            <TableCell width="15%" sx={styles.tableHeader}>Código</TableCell>
            <TableCell width="40%" sx={styles.tableHeader}>Descripción</TableCell>
            <TableCell width="15%" align="right" sx={styles.tableHeader}>Cantidad</TableCell>
            <TableCell width="15%" align="right" sx={styles.tableHeader}>Precio Unit.</TableCell>
            <TableCell width="15%" align="right" sx={styles.tableHeader}>Total</TableCell>
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