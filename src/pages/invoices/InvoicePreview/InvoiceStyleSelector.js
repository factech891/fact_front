// src/pages/invoices/InvoicePreview/InvoiceStyleSelector.js
import { Box, Button, ButtonGroup, Tooltip } from '@mui/material';
import { Palette, Style, Minimize, Business } from '@mui/icons-material';

const styles = {
  selectorContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

const invoiceStyles = [
  { 
    id: 'modern', 
    name: 'Moderno',
    icon: <Palette fontSize="small" />,
    tooltip: 'Diseño moderno con gradientes'
  },
  { 
    id: 'classic', 
    name: 'Clásico',
    icon: <Style fontSize="small" />,
    tooltip: 'Estilo clásico empresarial'
  },
  { 
    id: 'minimal', 
    name: 'Minimalista',
    icon: <Minimize fontSize="small" />,
    tooltip: 'Diseño minimalista y limpio'
  },
  { 
    id: 'professional', 
    name: 'Profesional',
    icon: <Business fontSize="small" />,
    tooltip: 'Diseño corporativo profesional'
  }
];

export const InvoiceStyleSelector = ({ currentStyle, onStyleChange }) => {
  return (
    <Box sx={styles.selectorContainer}>
      <ButtonGroup size="small">
        {invoiceStyles.map((style) => (
          <Tooltip key={style.id} title={style.tooltip} placement="bottom">
            <Button
              variant={currentStyle === style.id ? 'contained' : 'outlined'}
              onClick={() => onStyleChange(style.id)}
              startIcon={style.icon}
              sx={{
                textTransform: 'none',
                minWidth: '120px'
              }}
            >
              {style.name}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
    </Box>
  );
};