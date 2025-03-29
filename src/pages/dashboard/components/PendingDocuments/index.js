import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tooltip,
  Skeleton,
  Button
} from '@mui/material';
import {
  Description as DocumentIcon,
  ArrowForward as ArrowForwardIcon,
  InfoOutlined as InfoIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';
import { format, isAfter, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import useDocuments from '../../../hooks/useDocuments';
import DocumentStatusChip from '../../documents/components/DocumentStatusChip';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS } from '../../documents/constants/documentTypes';

// Utility to format currency values
const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const PendingDocuments = () => {
  const navigate = useNavigate();
  const { getPendingDocuments, convertToInvoice } = useDocuments();
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        setLoading(true);
        const data = await getPendingDocuments();
        setPendingDocuments(data);
      } catch (err) {
        setError(err.message || 'Error fetching pending documents');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDocuments();
  }, [getPendingDocuments]);

  // Handle document click
  const handleDocumentClick = (id) => {
    navigate(`/documents/view/${id}`);
  };

  // Handle convert to invoice click
  const handleConvertClick = async (id, event) => {
    event.stopPropagation(); // Prevent triggering the row click

    try {
      await convertToInvoice(id, { invoiceDate: new Date() });
      // Refresh pending documents
      const data = await getPendingDocuments();
      setPendingDocuments(data);
    } catch (err) {
      console.error('Error converting document to invoice:', err);
      // Could show a notification here
    }
  };

  // View all documents
  const handleViewAllClick = () => {
    navigate('/documents');
  };

  return (
    <Card>
      <CardHeader
        title="Documentos Pendientes"
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={handleViewAllClick}
          >
            Ver todos
          </Button>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          // Loading state
          <List>
            {[1, 2, 3].map((item) => (
              <ListItem key={item} disablePadding divider>
                <ListItemButton disabled>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Skeleton width="60%" />}
                    secondary={<Skeleton width="40%" />}
                  />
                  <ListItemSecondaryAction>
                    <Skeleton width={90} />
                  </ListItemSecondaryAction>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : error ? (
          // Error state
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">
              {error}
            </Typography>
          </Box>
        ) : pendingDocuments.length === 0 ? (
          // Empty state
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <InfoIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography color="textSecondary">
              No hay documentos pendientes
            </Typography>
          </Box>
        ) : (
          // Documents list
          <List disablePadding>
            {pendingDocuments.map((doc) => {
              const isExpiringSoon = doc.expiryDate && 
                isAfter(new Date(doc.expiryDate), new Date()) && 
                isAfter(new Date(doc.expiryDate), subDays(new Date(), 7));

              return (
                <ListItem 
                  key={doc._id} 
                  disablePadding 
                  divider
                  secondaryAction={
                    <Tooltip title="Convertir a factura">
                      <IconButton
                        edge="end"
                        onClick={(e) => handleConvertClick(doc._id, e)}
                        size="small"
                      >
                        <ConvertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemButton onClick={() => handleDocumentClick(doc._id)}>
                    <ListItemIcon>
                      <DocumentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" noWrap>
                            {doc.documentNumber || 'Sin número'} - {doc.client?.name}
                          </Typography>
                          <DocumentStatusChip status={doc.status} />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            {DOCUMENT_TYPE_NAMES[doc.type]} • {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color={isExpiringSoon ? 'warning.main' : 'text.secondary'}
                            fontWeight={isExpiringSoon ? 'medium' : 'normal'}
                          >
                            {formatCurrency(doc.total, doc.currency)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingDocuments;