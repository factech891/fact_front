// src/pages/clients/ClientTable.js
import { DataGrid } from '@mui/x-data-grid';
import { Card, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export const ClientTable = ({ clients = [], onEdit, onDelete }) => {
  const columns = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'rif', headerName: 'RIF', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1 },
    { field: 'direccion', headerName: 'Dirección', flex: 1.5 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(params.row)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => onDelete(params.row._id)} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = clients.map(client => ({
    id: client._id,
    _id: client._id,
    ...client,
  }));

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
        disableSelectionOnClick
        sx={{ minHeight: 400 }}
      />
    </Card>
  );
};