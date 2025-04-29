// src/components/platformAdmin/CompanyTable.js
import React, { useState } from 'react';
// --- Nota: El código base usa DataGrid, si necesitas DataGridPro y DetailPanel como en la solicitud anterior, asegúrate de usar ese código y ajustar este cambio allí. ---
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box, Chip, Tooltip, IconButton, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography
} from '@mui/material';
import { format, parseISO, differenceInCalendarDays } from 'date-fns'; // Importar differenceInCalendarDays
import { es } from 'date-fns/locale';

// Iconos para acciones
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

// Función segura para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = parseISO(dateString);
        return format(date, 'dd MMM yy', { locale: es });
    } catch (e) {
        console.error("Error parsing date for format:", dateString, e);
        return 'Inválida';
    }
};

// --- Inicio Modificación: Añadir función calculateTrialModification ---
const calculateTrialModification = (createdAt, trialEndDate) => {
    if (!createdAt || !trialEndDate) return { days: 0, text: "No disponible" };

    try {
        // Convertir fechas a objetos Date
        const creationDate = parseISO(createdAt);
        const endDate = parseISO(trialEndDate);

        // Período estándar de prueba (ej: 7 días desde la fecha de creación)
        // ¡IMPORTANTE! Asegúrate que esta lógica coincida con cómo se asigna el trial inicial.
        // Si el trial se asigna de otra forma (ej: siempre termina X días después del registro), ajusta 'expectedEndDate'.
        const standardTrialPeriodDays = 7;
        const expectedEndDate = new Date(creationDate);
        expectedEndDate.setDate(expectedEndDate.getDate() + standardTrialPeriodDays);

        // Calcular diferencia en días calendario
        const diffDays = differenceInCalendarDays(endDate, expectedEndDate);

        // Preparar texto a mostrar
        let text = "";
        if (diffDays > 0) {
            text = `+${diffDays} días adicionales al período estándar de ${standardTrialPeriodDays} días.`;
        } else if (diffDays < 0) {
             // Math.abs para mostrar el número positivo de días reducidos
            text = `-${Math.abs(diffDays)} días reducidos del período estándar de ${standardTrialPeriodDays} días.`;
        } else {
            text = `Período estándar de ${standardTrialPeriodDays} días (sin modificaciones).`;
        }

        return { days: diffDays, text };
    } catch (e) {
        console.error("Error calculating trial modification:", createdAt, trialEndDate, e);
        return { days: 0, text: "Error en cálculo" };
    }
};
// --- Fin Modificación: Añadir función calculateTrialModification ---

const CompanyTable = ({
    companies = [],
    onExtendTrial,
    onChangeStatus, // Asegúrate de que esta prop se use o elimínala si no
    onToggleActive,
    loadingAction,
    refreshCompanies // Asegúrate de que esta prop se use o elimínala si no
}) => {
    const [openTrialModal, setOpenTrialModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [trialDays, setTrialDays] = useState(7);

    const handleOpenTrialModal = (company) => {
        setSelectedCompany(company);
        // Sugerir 7 días por defecto, pero el admin puede cambiarlo
        setTrialDays(7);
        setOpenTrialModal(true);
    };

    const handleCloseTrialModal = () => {
        setOpenTrialModal(false);
        setSelectedCompany(null);
    };

    const handleConfirmExtendTrial = async () => {
        if (selectedCompany && trialDays !== 0) {
            try {
                await onExtendTrial(selectedCompany.id, trialDays);
            } finally {
                handleCloseTrialModal();
            }
        }
    };

    const handleToggleActive = async (companyId, currentActiveState) => {
         try {
            await onToggleActive(companyId, !currentActiveState);
         } finally {
            // El hook (asumido) ya se encarga de refrescar la lista
         }
    };

    // Preparar datos para evitar problemas con undefineds
    const processedRows = companies.map(company => {
        // Identificar si es la cuenta del sistema
        const isSystem =
            (company.name === "Sistema FactTech") ||
            (company.rif === "ADMIN-FACTTECH-001") ||
            (company.email && company.email.includes("riki386@hotmail.com"));

        return {
            ...company,
            // Agregar una propiedad para identificar fácilmente
            isSystemAccount: isSystem,
            // Pre-formatear las fechas para evitar problemas en la tabla
            // Mantener el formato simple aquí, la lógica compleja va al renderCell
            formattedTrialEndDate: isSystem ? "N/A" : formatDate(company.trialEndDate),
            formattedSubscriptionEndDate: isSystem ? "N/A" : formatDate(company.subscriptionEndDate),
            formattedCreatedAt: isSystem ? "N/A" : formatDate(company.createdAt)
        };
    });

    const columns = [
        { field: 'name', headerName: 'Nombre Compañía', flex: 1.5, minWidth: 180 },
        { field: 'rif', headerName: 'RIF/ID', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
        {
            field: 'active',
            headerName: 'Acceso',
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                if (!params.row) return null;

                if (params.row.isSystemAccount) {
                    return (
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Sistema"
                            color="secondary"
                            size="small"
                            variant="outlined"
                        />
                    );
                }

                return (
                    <Chip
                        icon={params.value ? <CheckCircleIcon /> : <CancelIcon />}
                        label={params.value ? 'Activa' : 'Inactiva'}
                        color={params.value ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                    />
                );
            }
        },
        {
            field: 'status',
            headerName: 'Suscripción',
            flex: 1,
            minWidth: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                if (!params.row) return null;

                if (params.row.isSystemAccount) {
                    return <Chip label="N/A" color="secondary" size="small" />;
                }

                let color = 'default';
                let label = params.value || 'N/A';
                switch (params.value?.toLowerCase()) {
                    case 'active': color = 'success'; label = 'Activa'; break;
                    case 'trial': color = 'info'; label = 'Prueba'; break;
                    case 'expired': color = 'warning'; label = 'Expirada'; break;
                    case 'cancelled': color = 'error'; label = 'Cancelada'; break;
                    default: label = params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : 'Desconocido';
                }
                return <Chip label={label} color={color} size="small" />;
            }
        },
        // --- Inicio Modificación: Reemplazar renderCell de formattedTrialEndDate ---
        {
            field: 'formattedTrialEndDate',
            headerName: 'Fin Prueba',
            flex: 0.9, // Ligeramente más ancho para acomodar el indicador
            minWidth: 130,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                if (!params.row) return null;

                if (params.row.isSystemAccount) {
                    return <span>N/A</span>;
                }

                // Calcular la modificación del período
                const modification = calculateTrialModification(
                    params.row.createdAt,
                    params.row.trialEndDate // Usar la fecha original de la fila
                );

                // Color según si es extensión o reducción
                const textColor = modification.days > 0 ? 'success.main' :
                                  modification.days < 0 ? 'error.main' : 'text.secondary'; // Usar secondary si es 0

                return (
                    <Tooltip title={modification.text} placement="top">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {/* Mostrar la fecha formateada que ya calculamos */}
                            <span>{params.value}</span>
                            {/* Mostrar indicador solo si hubo modificación */}
                            {modification.days !== 0 && (
                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: textColor, lineHeight: 1 }}>
                                    {/* Mostrar + o - explícitamente */}
                                    {`(${modification.days > 0 ? '+' : ''}${modification.days})`}
                                </Typography>
                            )}
                        </Box>
                    </Tooltip>
                );
            }
        },
        // --- Fin Modificación: Reemplazar renderCell de formattedTrialEndDate ---
        {
            field: 'formattedSubscriptionEndDate',
            headerName: 'Fin Susc.',
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => { // Añadido renderCell con Tooltip para consistencia
                if (!params.row) return null;
                if (params.row.isSystemAccount) { return <span>N/A</span>; }
                return ( <Tooltip title="Fecha de fin de suscripción activa (si aplica)."><span>{params.value}</span></Tooltip> );
            }
        },
        {
            field: 'formattedCreatedAt',
            headerName: 'Registro',
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => { // Añadido renderCell con Tooltip para consistencia
                if (!params.row) return null;
                if (params.row.isSystemAccount) { return <span>N/A</span>; }
                return ( <Tooltip title="Fecha de registro de la empresa en el sistema."><span>{params.value}</span></Tooltip> );
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 130,
            getActions: (params) => {
                if (!params.row || params.row.isSystemAccount) {
                    return [];
                }

                return [
                    <GridActionsCellItem
                        key={`toggle-${params.row.id}`}
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
                        key={`trial-${params.row.id}`}
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
                    />
                ];
            }
        },
    ];

    return (
        <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={processedRows}
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
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                     '& .MuiDataGrid-actionsCell': {
                        // overflow: 'visible', // Puede ser necesario quitarlo si usas DataGridPro con DetailPanel
                     },
                }}
            />

            {/* Modal para Extender/Reducir Trial */}
            <Dialog open={openTrialModal} onClose={handleCloseTrialModal} maxWidth="xs" fullWidth>
                <DialogTitle>Modificar Período de Prueba</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Compañía: <strong>{selectedCompany?.name}</strong>
                    </Typography>
                    {selectedCompany && (
                        <Typography variant="body2" color="textSecondary">
                            Fecha de prueba actual: {formatDate(selectedCompany.trialEndDate)}
                        </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: 1}}>
                        Introduce el número de días a añadir (positivo) o quitar (negativo) a la fecha actual. Cero no es válido.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="days"
                        label="Número de Días (+/-)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={trialDays}
                        onChange={(e) => setTrialDays(parseInt(e.target.value, 10) || 0)}
                        InputProps={{ inputProps: { step: 1 } }}
                        error={trialDays === 0}
                        helperText={trialDays === 0 ? "El número de días no puede ser cero." : ""}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleCloseTrialModal} variant="outlined">Cancelar</Button>
                    <Button
                        onClick={handleConfirmExtendTrial}
                        disabled={loadingAction || trialDays === 0}
                        variant="contained"
                    >
                        {loadingAction ? <CircularProgress size={20} /> : 'Confirmar Modificación'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CompanyTable;