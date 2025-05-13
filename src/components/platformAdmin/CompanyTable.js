// src/components/platformAdmin/CompanyTable.js
import React, { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box, Chip, Tooltip, IconButton, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography, Alert,
    Menu,
    MenuItem
} from '@mui/material';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Iconos para acciones
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// --- Componentes y funciones auxiliares ---

const formatDate = (dateString) => {
    // ... (sin cambios)
    if (!dateString) return '-';
    try { return format(parseISO(dateString), 'dd MMM yy', { locale: es }); }
    catch (e) { console.error("Error parsing date:", dateString, e); return 'Inválida'; }
};

const calculateTrialModification = (createdAt, trialEndDate) => {
    // ... (sin cambios)
    if (!createdAt || !trialEndDate) return { days: 0, text: "N/A" };
    try {
        const creationDate = parseISO(createdAt);
        const endDate = parseISO(trialEndDate);
        const standardTrialPeriodDays = 7;
        const expectedEndDate = new Date(creationDate);
        expectedEndDate.setDate(expectedEndDate.getDate() + standardTrialPeriodDays);
        const diffDays = differenceInCalendarDays(endDate, expectedEndDate);
        let text = `Estándar ${standardTrialPeriodDays} días`;
        if (diffDays > 0) text = `+${diffDays} días extra`;
        else if (diffDays < 0) text = `-${Math.abs(diffDays)} días menos`;
        return { days: diffDays, text: `(${text})` };
    } catch (e) { return { days: 0, text: "(Error)" }; }
};

const ActiveStatusChip = ({ isActive }) => (
    // ... (sin cambios)
    <Chip icon={isActive ? <CheckCircleIcon /> : <CancelIcon />} label={isActive ? 'Activa' : 'Inactiva'} color={isActive ? 'success' : 'error'} size="small" variant="outlined" />
);

// --- SubscriptionStatusChip REEMPLAZADO ---
const SubscriptionStatusChip = ({ status, onClick, loadingAction }) => {
    let color = 'default';
    let label = status || 'N/A';

    switch (status?.toLowerCase()) {
        case 'active': color = 'success'; label = 'Activa'; break;
        case 'trial': color = 'info'; label = 'Prueba'; break;
        case 'expired': color = 'warning'; label = 'Expirada'; break;
        case 'cancelled': color = 'error'; label = 'Cancelada'; break;
        default: label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Desc.';
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chip
                label={label}
                color={color}
                size="small"
                sx={{ cursor: onClick ? 'pointer' : 'default' }}
            />
            {onClick && (
                <IconButton
                    size="small"
                    onClick={onClick}
                    disabled={loadingAction}
                    sx={{ padding: '1px', marginLeft: '2px' }}
                >
                    <ExpandMoreIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

const CompanyTable = ({
    companies = [],
    onExtendTrial,
    onChangeStatus,
    onToggleActive,
    sendCompanyNotification,
    loadingAction,
    loadingCompanies,
    refreshCompanies
}) => {
    // Estados para el modal de Trial
    const [openTrialModal, setOpenTrialModal] = useState(false);
    const [selectedCompanyForTrial, setSelectedCompanyForTrial] = useState(null);
    const [trialDays, setTrialDays] = useState(7);

    // Estados para el modal de Notificación
    const [openNotifyModal, setOpenNotifyModal] = useState(false);
    const [selectedCompanyForNotify, setSelectedCompanyForNotify] = useState(null);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationError, setNotificationError] = useState('');

    // --- Estados para el menú de estado ---
    const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
    const [selectedCompanyForStatus, setSelectedCompanyForStatus] = useState(null);

    // --- Handlers para Modal de Trial ---
    const handleOpenTrialModal = (company) => {
        setSelectedCompanyForTrial(company);
        setTrialDays(7);
        setOpenTrialModal(true);
    };
    const handleCloseTrialModal = () => {
        setOpenTrialModal(false);
        setSelectedCompanyForTrial(null);
    };
    const handleConfirmExtendTrial = async () => {
        if (selectedCompanyForTrial && trialDays !== 0) {
            await onExtendTrial(selectedCompanyForTrial.id, trialDays);
            handleCloseTrialModal();
        }
    };

    // --- Handlers para Modal de Notificación ---
    const handleOpenNotifyModal = (company) => {
        if (!company) {
            console.error("Error: Se intentó abrir modal de notificación sin datos de compañía.");
            return;
        }
        setSelectedCompanyForNotify(company);
        setNotificationTitle('');
        setNotificationMessage('');
        setNotificationError('');
        setOpenNotifyModal(true);
    };
    const handleCloseNotifyModal = () => {
        setOpenNotifyModal(false);
        setSelectedCompanyForNotify(null);
        setNotificationError('');
    };
    const handleSendNotification = async () => {
        setNotificationError('');
        if (!notificationTitle.trim() || !notificationMessage.trim()) {
            setNotificationError('El título y el mensaje son requeridos.');
            return;
        }
        if (!selectedCompanyForNotify || !selectedCompanyForNotify.id) {
            console.error("Error en handleSendNotification: No hay compañía seleccionada o falta ID.");
            setNotificationError('Error interno: No se pudo identificar la compañía.');
            return;
        }
        if (typeof sendCompanyNotification !== 'function') {
            console.error("Error en handleSendNotification: La prop 'sendCompanyNotification' no es una función.");
            setNotificationError('Error interno: La función de envío no está disponible.');
            return;
        }
        try {
            const success = await sendCompanyNotification(selectedCompanyForNotify.id, {
                title: notificationTitle.trim(),
                message: notificationMessage.trim(),
                type: 'admin_message'
            });
            if (success) {
                handleCloseNotifyModal();
            } else {
                setNotificationError('Error al enviar la notificación. Revise la consola o el mensaje principal.');
            }
        } catch (error) {
             console.error("Error inesperado en handleSendNotification:", error);
             setNotificationError('Error inesperado al procesar el envío.');
        }
    };

    // --- Handler para Activar/Desactivar ---
    const handleToggleActive = async (companyId, currentActiveState) => {
        await onToggleActive(companyId, !currentActiveState);
    };

    // --- Handlers para el menú de estado (MODIFICADOS) ---
    const handleStatusClick = (event, company) => {
        event.stopPropagation(); // Prevenir que el click afecte a la fila
        setStatusMenuAnchor(event.currentTarget); // Anclar menú al elemento clickeado
        setSelectedCompanyForStatus(company); // Guardar la compañía seleccionada
    };
    const handleCloseStatusMenu = () => {
        setStatusMenuAnchor(null); // Limpiar anchor para cerrar menú
        setSelectedCompanyForStatus(null); // Limpiar compañía seleccionada
    };
    
    // MODIFICACIÓN IMPORTANTE: Desactivar automáticamente cuando se cambia a expirado o cancelado
    const handleChangeStatus = async (status) => {
        if (selectedCompanyForStatus && status && typeof onChangeStatus === 'function') {
            // Primero cambiamos el estado de suscripción
            await onChangeStatus(selectedCompanyForStatus.id, status);
            
            // Si el estado es 'expired' o 'cancelled', desactivamos automáticamente el acceso
            if ((status === 'expired' || status === 'cancelled') && 
                selectedCompanyForStatus.active && 
                typeof onToggleActive === 'function') {
                console.log(`Desactivando automáticamente empresa ${selectedCompanyForStatus.name} por cambio de estado a ${status}`);
                await onToggleActive(selectedCompanyForStatus.id, false);
            }
            
            handleCloseStatusMenu(); // Cerrar menú después de la acción
            
            // Refrescar la lista de compañías
            if (typeof refreshCompanies === 'function') {
                refreshCompanies();
            }
        } else {
            console.error("Error: No se pudo cambiar el estado - falta compañía, estado o función 'onChangeStatus'");
            handleCloseStatusMenu(); // Asegurarse de cerrar el menú igual
        }
    };
    // --- FIN Handlers MODIFICADOS ---

    // --- Procesamiento y Filtrado de Filas ---
    const processedRows = companies.map(company => ({
        ...company,
        isSystemAccount: (company.name === "Sistema FactTech") || (company.rif === "ADMIN-FACTTECH-001") || (company.email?.includes("riki386@hotmail.com")),
        formattedTrialEndDate: formatDate(company.trialEndDate),
        formattedSubscriptionEndDate: formatDate(company.subscriptionEndDate),
        formattedCreatedAt: formatDate(company.createdAt)
    }));
    const filteredRows = processedRows.filter(row => !row.isSystemAccount);

    // --- Definición de Columnas ---
    const columns = [
        // Columnas existentes (Nombre, RIF, Email, Acceso)
        { field: 'name', headerName: 'Nombre Compañía', flex: 1.5, minWidth: 180 },
        { field: 'rif', headerName: 'RIF/ID', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
        { field: 'active', headerName: 'Acceso', flex: 0.8, minWidth: 110, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <ActiveStatusChip isActive={params.value} /> : null },

        // Columna de Suscripción MODIFICADA
        {
            field: 'status',
            headerName: 'Suscripción',
            flex: 1,
            minWidth: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => params.row ? (
                <SubscriptionStatusChip
                    status={params.value}
                    onClick={(e) => handleStatusClick(e, params.row)}
                    loadingAction={loadingAction}
                />
            ) : null
        },
        // Columnas existentes (Fin Prueba, Fin Susc., Registro)
        {
            field: 'formattedTrialEndDate', headerName: 'Fin Prueba', flex: 0.9, minWidth: 130, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                if (!params.row) return null;
                const modification = calculateTrialModification(params.row.createdAt, params.row.trialEndDate);
                const textColor = modification.days > 0 ? 'success.main' : modification.days < 0 ? 'error.main' : 'text.secondary';
                return ( <Tooltip title={modification.text.replace(/[()]/g, '')} placement="top"><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}><span>{params.value}</span>{modification.days !== 0 && (<Typography variant="caption" sx={{ fontWeight: 'bold', color: textColor, lineHeight: 1 }}>{`(${modification.days > 0 ? '+' : ''}${modification.days})`}</Typography>)}</Box></Tooltip> );
            }
        },
        { field: 'formattedSubscriptionEndDate', headerName: 'Fin Susc.', flex: 0.8, minWidth: 110, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <Tooltip title="Fecha fin suscripción activa"><span>{params.value}</span></Tooltip> : null },
        { field: 'formattedCreatedAt', headerName: 'Registro', flex: 0.8, minWidth: 110, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <Tooltip title="Fecha registro"><span>{params.value}</span></Tooltip> : null },

        // Columna de Acciones (sin cambios, se mantiene)
        {
            field: 'actions', type: 'actions', headerName: 'Acciones', width: 150,
            getActions: (params) => {
                if (!params.row) return [];
                return [
                    <GridActionsCellItem key={`toggle-${params.row.id}`} icon={ <Tooltip title={params.row.active ? "Desactivar Acceso" : "Activar Acceso"}><IconButton size="small" color={params.row.active ? "error" : "success"}>{params.row.active ? <ToggleOffIcon /> : <ToggleOnIcon />}</IconButton></Tooltip> } label={params.row.active ? "Desactivar" : "Activar"} onClick={() => handleToggleActive(params.row.id, params.row.active)} disabled={loadingAction} showInMenu={false} />,
                    <GridActionsCellItem key={`trial-${params.row.id}`} icon={ <Tooltip title="Modificar Días de Prueba"><IconButton size="small" color="primary"><MoreTimeIcon /></IconButton></Tooltip> } label="Modificar Prueba" onClick={() => handleOpenTrialModal(params.row)} disabled={loadingAction} showInMenu={false} />,
                    <GridActionsCellItem key={`notify-${params.row.id}`} icon={ <Tooltip title="Enviar Notificación"><IconButton size="small" color="secondary"><NotificationsIcon /></IconButton></Tooltip> } label="Notificar" onClick={() => handleOpenNotifyModal(params.row)} disabled={loadingAction} showInMenu={false} />,
                ];
            }
        },
    ];

    return (
        <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] } }}
                getRowId={(row) => row.id}
                loading={loadingAction || loadingCompanies}
                disableRowSelectionOnClick
                density="compact"
                sx={{
                    border: 1, borderColor: 'divider', '& .MuiDataGrid-cell': { borderBottom: '1px solid #eee' },
                    '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover', fontWeight: 'bold' },
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': { borderBottom: 'none' },
                    '& .MuiDataGrid-actionsCell': { overflow: 'visible' },
                    '& .MuiDataGrid-cell[data-field="status"] > .MuiBox-root': { width: '100%', justifyContent: 'center' },
                }}
            />

            {/* --- Modal para Extender/Reducir Trial --- */}
            <Dialog open={openTrialModal} onClose={handleCloseTrialModal} maxWidth="xs" fullWidth>
                 <DialogTitle>Modificar Período de Prueba</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Compañía: <strong>{selectedCompanyForTrial?.name}</strong></Typography>
                    {selectedCompanyForTrial && (<Typography variant="body2" color="textSecondary">Prueba actual: {formatDate(selectedCompanyForTrial.trialEndDate)}</Typography>)}
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: 1}}>Añadir/quitar días a fecha actual. Cero no es válido.</Typography>
                    <TextField autoFocus margin="dense" id="days" label="Número de Días (+/-)" type="number" fullWidth variant="outlined" value={trialDays} onChange={(e) => setTrialDays(parseInt(e.target.value, 10) || 0)} InputProps={{ inputProps: { step: 1 } }} error={trialDays === 0} helperText={trialDays === 0 ? "No puede ser cero." : ""} />
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleCloseTrialModal} variant="outlined">Cancelar</Button>
                    <Button onClick={handleConfirmExtendTrial} disabled={loadingAction || trialDays === 0} variant="contained">{loadingAction ? <CircularProgress size={20} /> : 'Confirmar'}</Button>
                </DialogActions>
            </Dialog>

            {/* --- Modal para Enviar Notificación --- */}
            <Dialog open={openNotifyModal} onClose={handleCloseNotifyModal} maxWidth="sm" fullWidth>
                <DialogTitle>Enviar Notificación a Empresa</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Para: <strong>{selectedCompanyForNotify?.name}</strong> ({selectedCompanyForNotify?.email})</Typography>
                    {notificationError && (<Alert severity="error" sx={{ mb: 2 }} onClose={() => setNotificationError('')}>{notificationError}</Alert>)}
                    <TextField autoFocus margin="dense" id="notificationTitle" label="Título de la Notificación" type="text" fullWidth variant="outlined" value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} sx={{ mb: 2 }} error={notificationError.includes('título')} />
                    <TextField margin="dense" id="notificationMessage" label="Mensaje de la Notificación" type="text" fullWidth variant="outlined" multiline rows={4} value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} error={notificationError.includes('mensaje')} />
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleCloseNotifyModal} variant="outlined">Cancelar</Button>
                    <Button onClick={handleSendNotification} disabled={loadingAction || !notificationTitle.trim() || !notificationMessage.trim()} variant="contained" color="secondary">{loadingAction ? <CircularProgress size={20} /> : 'Enviar Notificación'}</Button>
                </DialogActions>
            </Dialog>

             {/* --- Menú para cambiar estado de suscripción --- */}
             <Menu
                anchorEl={statusMenuAnchor}
                open={Boolean(statusMenuAnchor)}
                onClose={handleCloseStatusMenu}
            >
                <MenuItem onClick={() => handleChangeStatus('trial')}>Período de Prueba</MenuItem>
                <MenuItem onClick={() => handleChangeStatus('active')}>Suscripción Activa</MenuItem>
                <MenuItem onClick={() => handleChangeStatus('expired')}>Expirada</MenuItem>
                <MenuItem onClick={() => handleChangeStatus('cancelled')}>Cancelada</MenuItem>
            </Menu>
        </Box>
    );
};

export default CompanyTable;