// src/pages/products/ProductTable.js
import { DataGrid } from '@mui/x-data-grid';
import { Card, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export const ProductTable = ({ products = [], onEdit, onDelete }) => {
  const columns = [
    { 
      field: 'codigo',
      headerName: 'Código',
      flex: 1
    },
    { 
      field: 'nombre',
      headerName: 'Nombre',
      flex: 1.5
    },
    {
      field: 'precio',
      headerName: 'Precio',
      flex: 1,
      renderCell: (params) => {
        console.log('Valor en renderCell:', params.row);
        const precio = params.row?.precio || 0;
        return `$${Number(precio).toFixed(2)}`;
      }
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
      renderCell: (params) => {
        return params.row?.stock || 0;
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Editar">
            <IconButton 
              onClick={() => params.row && onEdit(params.row)} 
              color="primary" 
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton 
              onClick={() => params.row?._id && onDelete(params.row._id)} 
              color="error" 
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // Asegurar que cada fila tenga todos los campos necesarios
  const rows = products.map(product => ({
    id: product._id || `temp-${Math.random()}`,
    _id: product._id || `temp-${Math.random()}`,
    codigo: product.codigo || '',
    nombre: product.nombre || '',
    precio: Number(product.precio || 0),
    stock: Number(product.stock || 0),
    descripcion: product.descripcion || ''
  }));

  console.log('Rows procesadas:', rows);

  return (
    <Card sx={{ width: '100%', height: 'auto', minHeight: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
        getRowId={(row) => row.id}
        loading={products.length === 0}
      />
    </Card>
  );
};