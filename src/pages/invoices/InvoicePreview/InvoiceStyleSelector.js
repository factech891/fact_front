import { Box, Button, ButtonGroup, Tooltip } from '@mui/material';
import { 
  Palette, 
  Style, 
  ViewStreamOutlined, 
  Business,
  Print,
  Download 
} from '@mui/icons-material';

const styles = {
  selectorContainer: {
    position: 'fixed', // Cambiado a fixed
    top: '10px',
    left: '10px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '3px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '@media print': {
      display: 'none !important' // Se oculta en impresión
    }
  },
  actionsContainer: {
    marginTop: '5px',
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
    icon: <ViewStreamOutlined fontSize="small" />,
    tooltip: 'Diseño minimalista y limpio'
  },
  { 
    id: 'professional', 
    name: 'Profesional',
    icon: <Business fontSize="small" />,
    tooltip: 'Diseño corporativo profesional'
  }
];

export const InvoiceStyleSelector = ({ 
  currentStyle, 
  onStyleChange,
  onDownload,
  onPrint
}) => {
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
                minWidth: '80px',      //reducir el ancho
                fontSize: '8px',        //reducir la fuente
                py: 0.00345            //reducir el tamaño completo  
              }}
            >
              {style.name}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>

      {/* Sección de acciones (Descargar e Imprimir) */}
      {(onDownload || onPrint) && (
        <Box sx={styles.actionsContainer}>
          <ButtonGroup size="small">
            {onDownload && (
              <Tooltip title="Descargar PDF">
                <Button
                  onClick={onDownload}
                  startIcon={<Download />}
                  variant="outlined"
                  color="primary"
                >
                  Descargar
                </Button>
              </Tooltip>
            )}
            {onPrint && (
              <Tooltip title="Imprimir">
                <Button
                  onClick={onPrint}
                  startIcon={<Print />}
                  variant="outlined"
                  color="primary"
                >
                  Imprimir
                </Button>
              </Tooltip>
            )}
          </ButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default InvoiceStyleSelector;