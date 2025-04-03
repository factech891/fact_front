// src/pages/products/ProductTable.js
import { DataGrid } from '@mui/x-data-grid';
import { Card, IconButton, Tooltip, Box } from '@mui/material'; 
import { Edit, Delete } from '@mui/icons-material';

// Helper para formatear moneda
const formatCurrency = (value, currencySymbol = 'Bs.') => {
  const number = Number(value) || 0;
  return `${currencySymbol} ${number.toFixed(2)}`; 
};

export const ProductTable = ({ products = [], onEdit, onDelete, loading }) => { 
  // ----- AJUSTES EN LAS COLUMNAS (flex y minWidth) -----
  const columns = [
    { 
      field: 'codigo',
      headerName: 'Código',
      // Damos un flex menor y ancho mínimo
      flex: 0.7, 
      minWidth: 100, 
    },
    { 
      field: 'nombre',
      headerName: 'Nombre',
       // Reducimos el flex y aseguramos ancho mínimo razonable
      flex: 1.3, // Era 1.5
      minWidth: 200,
    },
    {
      field: 'precio',
      headerName: 'Precio',
      // Mantenemos flex 1, añadimos ancho mínimo
      flex: 1, 
      minWidth: 130, 
      align: 'right', 
      headerAlign: 'right', 
      renderCell: (params) => {
        return formatCurrency(params.row?.precio, 'Bs.'); 
      }
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number', 
       // Mantenemos flex 1, añadimos ancho mínimo
      flex: 0.8, // Reducido ligeramente
      minWidth: 100,
      align: 'right', 
      headerAlign: 'right', 
      renderCell: (params) => {
        return params.row?.stock ?? 0; // Usar ?? para default en 0 o null/undefined
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      // Mantenemos ancho fijo
      width: 120, 
      sortable: false,
      disableColumnMenu: true, 
      align: 'center', // Centrar contenido de la celda
      headerAlign: 'center', // Centrar cabecera
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}> 
          <Tooltip title="Editar">
            <IconButton 
              onClick={() => params.row?._id && onEdit(params.row)} 
              color="primary" 
              size="small"
              disabled={!params.row?._id} 
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton 
              onClick={() => params.row?._id && onDelete(params.row._id)} 
              color="error" 
              size="small"
              disabled={!params.row?._id}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
  // ----- FIN AJUSTES COLUMNAS -----

  const rows = products.map((product, index) => ({
    id: product?._id || `temp-id-${index}`, 
    _id: product?._id, 
    codigo: product?.codigo || '',
    nombre: product?.nombre || '',
    precio: Number(product?.precio || 0), 
    stock: Number(product?.stock || 0),
    descripcion: product?.descripcion || ''
  }));

  return (
    <Card sx={{ width: '100%', height: 'auto', /* minHeight quitado para que autoHeight funcione mejor */ }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 } 
          },
          sorting: {
            sortModel: [{ field: 'nombre', sort: 'asc' }], 
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]} 
        disableRowSelectionOnClick
        autoHeight // Clave para ajustar altura al contenido
        loading={loading} 
        sx={{ 
          border: 'none', 
          '& .MuiDataGrid-cell': {
            // Podrías añadir padding aquí si quieres más espacio interno en celdas
             py: 1, // Padding vertical ligero
          },
          '& .MuiDataGrid-columnHeaders': {
             backgroundColor: 'rgba(255, 255, 255, 0.05)', 
             // Podrías ajustar altura o padding de cabeceras
             // height: 56, // Altura por defecto
          },
          '& .MuiDataGrid-footerContainer': {
             backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
           // Quitar borde inferior de la última fila para que encaje con Card
          '& .MuiDataGrid-row:last-child': {
             borderBottom: 'none',
          },
           // Asegurar que las celdas no tengan borde inferior si la tabla no tiene borde
           '& .MuiDataGrid-cell': {
             borderBottom: 'none',
           },
           // Si quieres líneas divisorias entre columnas:
           // '& .MuiDataGrid-columnSeparator': {
           //   visibility: 'visible',
           // },
        }}
      />
    </Card>
  );
};