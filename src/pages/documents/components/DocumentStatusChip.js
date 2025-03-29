import React from 'react';
import { Chip } from '@mui/material';
import { 
  Edit as DraftIcon,
  Send as SentIcon, 
  Check as ApprovedIcon, 
  Close as RejectedIcon, 
  AccessTime as ExpiredIcon,
  Transform as ConvertedIcon
} from '@mui/icons-material';

import { 
  DOCUMENT_STATUS, 
  DOCUMENT_STATUS_NAMES, 
  DOCUMENT_STATUS_COLORS 
} from '../constants/documentTypes';

const DocumentStatusChip = ({ status }) => {
  // Map status to icon
  const getStatusIcon = (status) => {
    switch (status) {
      case DOCUMENT_STATUS.DRAFT:
        return <DraftIcon fontSize="small" />;
      case DOCUMENT_STATUS.SENT:
        return <SentIcon fontSize="small" />;
      case DOCUMENT_STATUS.APPROVED:
        return <ApprovedIcon fontSize="small" />;
      case DOCUMENT_STATUS.REJECTED:
        return <RejectedIcon fontSize="small" />;
      case DOCUMENT_STATUS.EXPIRED:
        return <ExpiredIcon fontSize="small" />;
      case DOCUMENT_STATUS.CONVERTED:
        return <ConvertedIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Chip
      label={DOCUMENT_STATUS_NAMES[status] || 'Desconocido'}
      color={DOCUMENT_STATUS_COLORS[status] || 'default'}
      size="small"
      icon={getStatusIcon(status)}
      variant="outlined"
    />
  );
};

export default DocumentStatusChip;