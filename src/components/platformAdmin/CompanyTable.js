// src/components/platformAdmin/CompanyTable.js
import React, { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box, Chip, Tooltip, IconButton, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography // <--- AÑADIDO AQUÍ
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Iconos para acciones
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Activo
import CancelIcon from '@mui/icons-material/Cancel'; // Inactivo
import EditIcon from '@mui/icons-material/Edit'; // Cambiar estado (genérico)
import MoreTimeIcon from '@mui/icons-material/MoreTime'; // Extender trial
import ToggleOnIcon from '@mui/icons-material/ToggleOn'; // Activar
import ToggleOffIcon from '@mui/icons-material/ToggleOff'; // Desactivar

// Componente para mostrar el estado de activación
const ActiveStatusChip = ({ isActive }) => (
    <Chip
        icon={isActive ? <CheckCircleIcon /> : <CancelIcon />}
        label={isActive ? 'Activa' : 'Inactiva'}
        color={isActive ? 'success' : 'error'}
        size="small"
        variant="outlined"
    />
);

// Componente para mostrar el estado de suscripción
const SubscriptionStatusChip = ({ status }) => {
    let color = 'default';
    let label = status || 'N/A';
    switch (status?.toLowerCase()) {
        case 'active': color = 'success'; label = 'Activa'; break;
        case 'trial': color = 'info'; label = 'Prueba'; break;
        case 'expired': color = 'warning'; label = 'Expirada'; break;
        case 'cancelled': color = 'error'; label = 'Cancelada'; break;
        default: label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Desconocido';
    }
    return <Chip label={label} color={color} size="small" />;
};

// Función para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = parseISO(dateString);
        return format(date, 'dd MMM yy', { locale: es }); // Formato más corto dd MMM yy
    } catch (e) {
        return 'Inválida';
    }
};

const CompanyTable = ({
    companies = [],
    onExtendTrial,
    onChangeStatus, // Cambiar estado de suscripción
    onToggleActive, // Activar/desactivar compañía
    loadingAction,
    refreshCompanies // Función para refrescar datos
}) => {
    const [openTrialModal, setOpenTrialModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [trialDays, setTrialDays] = useState(7); // Valor por defecto para extender

    const handleOpenTrialModal = (company) => {
        setSelectedCompany(company);
        setTrialDays(7); // Resetear a 7 días por defecto
        setOpenTrialModal(true);
    };

    const handleCloseTrialModal = () => {
        setOpenTrialModal(false);
        setSelectedCompany(null);
    };

    const handleConfirmExtendTrial = async () => {
        if (selectedCompany && trialDays !== 0) {
            // Mostrar feedback visual de carga si es posible
            // setLoadingAction(true); // Idealmente manejado por el hook padre
            try {
                await onExtendTrial(selectedCompany.id, trialDays);
            } finally {
                // setLoadingAction(false); // Idealmente manejado por el hook padre
                handleCloseTrialModal();
                // El hook `usePlatformAdmin` ya se encarga de refrescar la lista.
            }
        }
    };

    const handleToggleActive = async (companyId, currentActiveState) => {
         // Mostrar feedback visual de carga si es posible
         // setLoadingAction(true); // Idealmente manejado por el hook padre
         try {
            await onToggleActive(companyId, !currentActiveState);
         } finally {
            // setLoadingAction(false); // Idealmente manejado por el hook padre
            // El hook `usePlatformAdmin` ya se encarga de refrescar la lista.
         }
    };

    // Definición de columnas para DataGrid
    const columns = [
        { field: 'name', headerName: 'Nombre Compañía', flex: 1.5, minWidth: 180 },
        { field: 'rif', headerName: 'RIF/ID', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
        {
            field: 'active',
            headerName: 'Acceso', // Más corto
            flex: 0.8, // Un poco más angosto
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <ActiveStatusChip isActive={params.value} />,
        },
        {
            field: 'status', // Estado de la suscripción
            headerName: 'Suscripción', // Más corto
            flex: 1,
            minWidth: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <SubscriptionStatusChip status={params.value} />,
        },
        {
            field: 'trialEndDate',
            headerName: 'Fin Prueba',
            type: 'date', // Indicar tipo fecha para posible ordenación
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value) => value ? parseISO(value) : null, // Convertir a objeto Date para DataGrid
            renderCell: (params) => formatDate(params.value), // Formatear para mostrar
        },
        {
            field: 'subscriptionEndDate',
            headerName: 'Fin Susc.', // Más corto
            type: 'date',
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value) => value ? parseISO(value) : null,
            renderCell: (params) => formatDate(params.value),
        },
        {
            field: 'createdAt',
            headerName: 'Registro', // Más corto
            type: 'date',
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value) => value ? parseISO(value) : null,
            renderCell: (params) => formatDate(params.value),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 130, // Ajustar ancho si es necesario
            getActions: (params) => [
                <GridActionsCellItem
                    icon={
                        <Tooltip title={params.row.active ? "Desactivar Acceso" : "Activar Acceso"}>
                            <IconButton size="small" color={params.row.active ? "error" : "success"}>
                                {params.row.active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                            </IconButton>
                        </Tooltip>
                    }
                    label={params.row.active ? "Desactivar" : "Activar"}
                    onClick={() => handleToggleActive(params.row.id, params.row.active)}
                    disabled={loadingAction}
                    showInMenu={false}
                />,
                 <GridActionsCellItem
                    icon={
                        <Tooltip title="Modificar Días de Prueba">
                            <IconButton size="small" color="primary">
                                <MoreTimeIcon />
                            </IconButton>
                        </Tooltip>
                    }
                    label="Modificar Prueba"
                    onClick={() => handleOpenTrialModal(params.row)}
                    disabled={loadingAction}
                    showInMenu={false}
                />,
                // Aquí iría el botón/menú para cambiar estado si se implementa
            ],
        },
    ];

    return (
        <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={companies}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    sorting: {
                        sortModel: [{ field: 'createdAt', sort: 'desc' }],
                    },
                }}
                getRowId={(row) => row.id}
                loading={loadingAction}
                disableRowSelectionOnClick
                // Densidad para ocupar menos espacio vertical
                density="compact"
                sx={{
                    border: 1,
                    borderColor: 'divider',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #eee',
                    },
                     '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'action.hover',
                        fontWeight: 'bold',
                    },
                    // Quitar borde de la última fila
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                     // Estilo para acciones para que no se corten
                     '& .MuiDataGrid-actionsCell': {
                        overflow: 'visible',
                    },
                }}
            />

            {/* Modal para Extender/Reducir Trial */}
            <Dialog open={openTrialModal} onClose={handleCloseTrialModal} maxWidth="xs" fullWidth>
                <DialogTitle>Modificar Período de Prueba</DialogTitle>
                <DialogContent>
                    {/* Aquí se usa Typography */}
                    <Typography gutterBottom>
                        Compañía: <strong>{selectedCompany?.name}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Introduce el número de días a añadir (positivo) o quitar (negativo). Cero no es válido.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="days"
                        label="Número de Días (+/-)"
                        type="number"
                        fullWidth
                        variant="outlined" // Cambiado a outlined para mejor visibilidad
                        value={trialDays}
                        onChange={(e) => setTrialDays(parseInt(e.target.value, 10) || 0)}
                        InputProps={{ inputProps: { step: 1 } }}
                        error={trialDays === 0} // Marcar error si es cero
                        helperText={trialDays === 0 ? "El número de días no puede ser cero." : ""}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleCloseTrialModal} variant="outlined">Cancelar</Button>
                    <Button
                        onClick={handleConfirmExtendTrial}
                        disabled={loadingAction || trialDays === 0}
                        variant="contained" // Botón principal contenido
                    >
                        {loadingAction ? <CircularProgress size={20} /> : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CompanyTable;