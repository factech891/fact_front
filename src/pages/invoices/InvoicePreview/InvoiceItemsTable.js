// src/pages/invoices/InvoicePreview/InvoiceItemsTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export const InvoiceItemsTable = ({ items = [], moneda = 'VES', theme = {} }) => {
  if (!items || items.length === 0) return null;
  
  // Estilos base
  const tableStyle = {
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
    borderCollapse: 'collapse'
  };
  
  // Encabezado de la tabla
  const headerCellStyle = {
    backgroundColor: theme.primary || '#003366',
    color: '#FFFFFF',
    padding: '10px 8px',
    fontWeight: 'bold',
    textAlign: 'left',
    borderBottom: '2px solid #ddd'
  };
  
  // Estilo de celdas normales
  const cellStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    color: '#333',
    backgroundColor: '#FFFFFF'
  };
  
  // Estilos para los indicadores de exento
  const exentoStyle = {
    backgroundColor: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '12px',
    display: 'inline-block',
    fontSize: '12px',
    width: '80px',
    textAlign: 'center'
  };
  
  const noExentoStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '12px',
    display: 'inline-block',
    fontSize: '12px',
    width: '80px',
    textAlign: 'center'
  };
  
  return (
    <TableContainer component={Paper} elevation={0} className="invoice-items-table" 
      sx={{ backgroundColor: 'transparent' }}>
      <Table style={tableStyle}>
        <TableHead>
          <TableRow>
            <TableCell style={{...headerCellStyle, width: '15%'}}>Código</TableCell>
            <TableCell style={{...headerCellStyle, width: '35%'}}>Descripción</TableCell>
            <TableCell style={{...headerCellStyle, width: '10%', textAlign: 'center'}}>Cantidad</TableCell>
            <TableCell style={{...headerCellStyle, width: '15%', textAlign: 'right'}}>Precio Unit.</TableCell>
            <TableCell style={{...headerCellStyle, width: '15%', textAlign: 'right'}}>Total</TableCell>
            <TableCell style={{...headerCellStyle, width: '10%', textAlign: 'center'}}>Exento IVA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => {
            // Aplicar color alternado a las filas
            const rowColor = index % 2 === 0 ? '#FFFFFF' : '#F9F9F9';
            
            return (
              <TableRow key={index} style={{ backgroundColor: rowColor }}>
                <TableCell style={cellStyle}>{item.codigo || ''}</TableCell>
                <TableCell style={cellStyle}>{item.descripcion || ''}</TableCell>
                <TableCell style={{...cellStyle, textAlign: 'center'}}>
                  {typeof item.cantidad === 'number' ? item.cantidad.toFixed(2) : '1.00'}
                </TableCell>
                <TableCell style={{...cellStyle, textAlign: 'right'}}>
                  {moneda} {typeof item.precioUnitario === 'number' ? item.precioUnitario.toFixed(2) : '0.00'}
                </TableCell>
                <TableCell style={{...cellStyle, textAlign: 'right'}}>
                  {moneda} {((typeof item.cantidad === 'number' ? item.cantidad : 1) * 
                           (typeof item.precioUnitario === 'number' ? item.precioUnitario : 0)).toFixed(2)}
                </TableCell>
                <TableCell style={{...cellStyle, textAlign: 'center'}} className="exento-iva-column">
                  <div 
                    style={item.exentoIva ? exentoStyle : noExentoStyle}
                  >
                    {item.exentoIva ? 'EXENTO' : 'NO'}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceItemsTable;