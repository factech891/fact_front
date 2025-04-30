// src/components/platformAdmin/CompanyTable.js
import React, { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box, Chip, Tooltip, IconButton, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography, Alert // Importar Alert para mostrar errores en modal
} from '@mui/material';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Iconos para acciones
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Icono para notificar

// Componentes y funciones auxiliares (formatDate, calculateTrialModification, ActiveStatusChip, SubscriptionStatusChip)
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try { return format(parseISO(dateString), 'dd MMM yy', { locale: es }); }
    catch (e) { console.error("Error parsing date:", dateString, e); return 'Inválida'; }
};
const calculateTrialModification = (createdAt, trialEndDate) => {
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
const ActiveStatusChip = ({ isActive }) => ( <Chip icon={isActive ? <CheckCircleIcon /> : <CancelIcon />} label={isActive ? 'Activa' : 'Inactiva'} color={isActive ? 'success' : 'error'} size="small" variant="outlined" /> );
const SubscriptionStatusChip = ({ status }) => { let color = 'default'; let label = status || 'N/A'; switch (status?.toLowerCase()) { case 'active': color = 'success'; label = 'Activa'; break; case 'trial': color = 'info'; label = 'Prueba'; break; case 'expired': color = 'warning'; label = 'Expirada'; break; case 'cancelled': color = 'error'; label = 'Cancelada'; break; default: label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Desc.'; } return <Chip label={label} color={color} size="small" />; };


const CompanyTable = ({
    companies = [],
    onExtendTrial,
    onChangeStatus,
    onToggleActive,
    sendCompanyNotification, // <-- Prop para la función de envío
    loadingAction,
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

    // --- Handlers para Modal de Trial ---
    const handleOpenTrialModal = (company) => { /* ... sin cambios ... */
        setSelectedCompanyForTrial(company);
        setTrialDays(7);
        setOpenTrialModal(true);
    };
    const handleCloseTrialModal = () => { /* ... sin cambios ... */
        setOpenTrialModal(false);
        setSelectedCompanyForTrial(null);
    };
    const handleConfirmExtendTrial = async () => { /* ... sin cambios ... */
        if (selectedCompanyForTrial && trialDays !== 0) {
            await onExtendTrial(selectedCompanyForTrial.id, trialDays);
            handleCloseTrialModal();
        }
    };

    // --- Handlers para Modal de Notificación (Refinados) ---
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
        setNotificationError(''); // Limpiar error previo

        // 1. Validar campos del formulario
        if (!notificationTitle.trim() || !notificationMessage.trim()) {
            setNotificationError('El título y el mensaje son requeridos.');
            return;
        }

        // 2. Validar que la compañía esté seleccionada
        if (!selectedCompanyForNotify || !selectedCompanyForNotify.id) {
            console.error("Error en handleSendNotification: No hay compañía seleccionada o falta ID.");
            setNotificationError('Error interno: No se pudo identificar la compañía.');
            return;
        }

        // 3. Validar que la función de envío exista (pasada como prop)
        if (typeof sendCompanyNotification !== 'function') {
            console.error("Error en handleSendNotification: La prop 'sendCompanyNotification' no es una función.");
            setNotificationError('Error interno: La función de envío no está disponible.');
            return;
        }

        // 4. Intentar enviar la notificación
        try {
            const success = await sendCompanyNotification(selectedCompanyForNotify.id, {
                title: notificationTitle.trim(),
                message: notificationMessage.trim(),
                type: 'admin_message' // O permitir seleccionar tipo
            });

            if (success) {
                handleCloseNotifyModal(); // Cerrar modal en éxito
            } else {
                // Si la función del hook devuelve false, significa que hubo un error (ya manejado y mostrado en la alerta principal por el hook)
                // Mostramos un mensaje genérico en el modal también.
                setNotificationError('Error al enviar la notificación. Revise la consola o el mensaje principal.');
            }
        } catch (error) {
             // Capturar errores inesperados durante la llamada (poco probable si el hook maneja bien)
             console.error("Error inesperado en handleSendNotification:", error);
             setNotificationError('Error inesperado al procesar el envío.');
        }
    };


    // --- Handler para Activar/Desactivar ---
    const handleToggleActive = async (companyId, currentActiveState) => { /* ... sin cambios ... */
         await onToggleActive(companyId, !currentActiveState);
    };

    // --- Procesamiento y Filtrado de Filas ---
    const processedRows = companies.map(company => ({ /* ... sin cambios ... */
        ...company,
        isSystemAccount: (company.name === "Sistema FactTech") || (company.rif === "ADMIN-FACTTECH-001") || (company.email?.includes("riki386@hotmail.com")),
        formattedTrialEndDate: formatDate(company.trialEndDate),
        formattedSubscriptionEndDate: formatDate(company.subscriptionEndDate),
        formattedCreatedAt: formatDate(company.createdAt)
    }));
    const filteredRows = processedRows.filter(row => !row.isSystemAccount);

    // --- Definición de Columnas ---
    const columns = [
        // Columnas existentes
        { field: 'name', headerName: 'Nombre Compañía', flex: 1.5, minWidth: 180 },
        { field: 'rif', headerName: 'RIF/ID', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
        { field: 'active', headerName: 'Acceso', flex: 0.8, minWidth: 110, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <ActiveStatusChip isActive={params.value} /> : null },
        { field: 'status', headerName: 'Suscripción', flex: 1, minWidth: 120, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <SubscriptionStatusChip status={params.value} /> : null },
        {
            field: 'formattedTrialEndDate', headerName: 'Fin Prueba', flex: 0.9, minWidth: 130, align: 'center', headerAlign: 'center',
            renderCell: (params) => { /* ... sin cambios ... */
                if (!params.row) return null;
                const modification = calculateTrialModification(params.row.createdAt, params.row.trialEndDate);
                const textColor = modification.days > 0 ? 'success.main' : modification.days < 0 ? 'error.main' : 'text.secondary';
                return ( <Tooltip title={modification.text.replace(/[()]/g, '')} placement="top"><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}><span>{params.value}</span>{modification.days !== 0 && (<Typography variant="caption" sx={{ fontWeight: 'bold', color: textColor, lineHeight: 1 }}>{`(${modification.days > 0 ? '+' : ''}${modification.days})`}</Typography>)}</Box></Tooltip> );
            }
        },
        { field: 'formattedSubscriptionEndDate', headerName: 'Fin Susc.', flex: 0.8, minWidth: 110, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <Tooltip title="Fecha fin suscripción activa"><span>{params.value}</span></Tooltip> : null },
        { field: 'formattedCreatedAt', headerName: 'Registro', flex: 0.8, minWidth: 110, align: 'center', headerAlign: 'center', renderCell: (params) => params.row ? <Tooltip title="Fecha registro"><span>{params.value}</span></Tooltip> : null },
        {
            field: 'actions', type: 'actions', headerName: 'Acciones', width: 150, // Ancho ajustado
            getActions: (params) => {
                if (!params.row) return [];
                return [
                    // Botón Activar/Desactivar
                    <GridActionsCellItem key={`toggle-${params.row.id}`} icon={ <Tooltip title={params.row.active ? "Desactivar Acceso" : "Activar Acceso"}><IconButton size="small" color={params.row.active ? "error" : "success"}>{params.row.active ? <ToggleOffIcon /> : <ToggleOnIcon />}</IconButton></Tooltip> } label={params.row.active ? "Desactivar" : "Activar"} onClick={() => handleToggleActive(params.row.id, params.row.active)} disabled={loadingAction} showInMenu={false} />,
                    // Botón Modificar Trial
                    <GridActionsCellItem key={`trial-${params.row.id}`} icon={ <Tooltip title="Modificar Días de Prueba"><IconButton size="small" color="primary"><MoreTimeIcon /></IconButton></Tooltip> } label="Modificar Prueba" onClick={() => handleOpenTrialModal(params.row)} disabled={loadingAction} showInMenu={false} />,
                    // Botón Enviar Notificación
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
                // Props existentes
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] } }}
                getRowId={(row) => row.id}
                loading={loadingAction}
                disableRowSelectionOnClick
                density="compact"
                sx={{ /* Estilos existentes */
                    border: 1, borderColor: 'divider', '& .MuiDataGrid-cell': { borderBottom: '1px solid #eee' },
                    '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover', fontWeight: 'bold' },
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': { borderBottom: 'none' },
                    '& .MuiDataGrid-actionsCell': { overflow: 'visible' },
                }}
            />

            {/* --- Modal para Extender/Reducir Trial (sin cambios) --- */}
            <Dialog open={openTrialModal} onClose={handleCloseTrialModal} maxWidth="xs" fullWidth>
                {/* ... contenido del modal de trial sin cambios ... */}
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

            {/* --- Modal para Enviar Notificación (Refinado) --- */}
            <Dialog open={openNotifyModal} onClose={handleCloseNotifyModal} maxWidth="sm" fullWidth>
                <DialogTitle>Enviar Notificación a Empresa</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Para: <strong>{selectedCompanyForNotify?.name}</strong> ({selectedCompanyForNotify?.email})
                    </Typography>
                    {/* Mostrar error específico del modal */}
                    {notificationError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setNotificationError('')}> {/* Añadir botón para cerrar alerta */}
                            {notificationError}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="notificationTitle"
                        label="Título de la Notificación"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        sx={{ mb: 2 }}
                        error={notificationError.includes('título')} // Marcar si el error menciona título
                    />
                    <TextField
                        margin="dense"
                        id="notificationMessage"
                        label="Mensaje de la Notificación"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        error={notificationError.includes('mensaje')} // Marcar si el error menciona mensaje
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleCloseNotifyModal} variant="outlined">Cancelar</Button>
                    <Button
                        onClick={handleSendNotification}
                        disabled={loadingAction || !notificationTitle.trim() || !notificationMessage.trim()} // Usar trim() para validación
                        variant="contained"
                        color="secondary"
                    >
                        {loadingAction ? <CircularProgress size={20} /> : 'Enviar Notificación'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CompanyTable;