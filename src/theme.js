import { createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; 

// --- Define Colores Base ---
const PRIMARY_COLOR = '#4facfe'; 
const SECONDARY_COLOR = '#00f2fe'; 
const BACKGROUND_DEFAULT = '#000000'; 
const BACKGROUND_PAPER = '#1e1e1e'; 
const TEXT_PRIMARY = '#FFFFFF'; 
const TEXT_SECONDARY = '#B0B0B0'; 
const ERROR_COLOR = '#f44336'; 
// Definimos un color para éxito (usado en Register Stepper)
const SUCCESS_COLOR = '#66bb6a'; // Verde estándar de Material UI

// --- Crea el Tema ---
const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: PRIMARY_COLOR, 
      contrastText: '#FFFFFF', 
    },
    secondary: { 
      main: SECONDARY_COLOR, 
    },
    background: {
      default: BACKGROUND_DEFAULT, 
      paper: BACKGROUND_PAPER,   
    },
    text: {
      primary: TEXT_PRIMARY,     
      secondary: TEXT_SECONDARY, 
    },
    error: {
      main: ERROR_COLOR,
    },
    success: { // Añadimos el color de éxito a la paleta
        main: SUCCESS_COLOR,
        contrastText: '#000000', // Texto oscuro sobre verde claro
    },
    // Definimos colores para action.disabled y action.disabledBackground
    // que se usarán automáticamente por los componentes MUI en estado disabled
    action: {
        disabledBackground: `rgba(${parseInt(PRIMARY_COLOR.slice(1, 3), 16)}, ${parseInt(PRIMARY_COLOR.slice(3, 5), 16)}, ${parseInt(PRIMARY_COLOR.slice(5, 7), 16)}, 0.3)`, // Azul primario con opacidad
        disabled: 'rgba(255, 255, 255, 0.5)', // Texto blanco con opacidad
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
    h5: { 
      fontWeight: 700, 
      marginBottom: '1rem', 
    },
    button: {
      textTransform: 'none', 
      fontWeight: 600,       
    },
    body2: { 
        color: TEXT_SECONDARY, 
    }
  },
  components: {
    MuiCssBaseline: { 
        styleOverrides: {
            body: {
                backgroundColor: BACKGROUND_DEFAULT,
            },
        },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', 
        },
        rounded: {
           borderRadius: 12, 
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, 
          padding: '10px 20px', 
          // Corrección: Usamos '&.Mui-disabled' para sobrescribir el estado disabled
          '&.Mui-disabled': {
            // Usamos los colores definidos en palette.action
            backgroundColor: `rgba(${parseInt(PRIMARY_COLOR.slice(1, 3), 16)}, ${parseInt(PRIMARY_COLOR.slice(3, 5), 16)}, ${parseInt(PRIMARY_COLOR.slice(5, 7), 16)}, 0.3)`, 
            color: 'rgba(255, 255, 255, 0.5)', 
            cursor: 'not-allowed',
            pointerEvents: 'auto', 
          }
        },
        // Los estilos específicos para containedPrimary, etc., pueden ir aquí si es necesario
        // pero el estilo base del degradado se aplica con 'sx' en el componente.
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', 
      },
      styleOverrides: {
        root: {
          '& label': {
            color: TEXT_SECONDARY, 
          },
          '& label.Mui-focused': {
            color: PRIMARY_COLOR, 
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: TEXT_SECONDARY, 
            },
            '&:hover fieldset': {
               borderColor: TEXT_PRIMARY, 
            },
            '&.Mui-focused fieldset': {
              borderColor: PRIMARY_COLOR, 
            },
            '& input': {
                color: TEXT_PRIMARY,
            },
            // Estilo para el input deshabilitado
            '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fondo ligeramente diferente
                '& fieldset': {
                    borderColor: `rgba(${parseInt(TEXT_SECONDARY.slice(1, 3), 16)}, ${parseInt(TEXT_SECONDARY.slice(3, 5), 16)}, ${parseInt(TEXT_SECONDARY.slice(5, 7), 16)}, 0.5)`, // Borde más tenue
                },
                 '& input': {
                    // Color del texto deshabilitado (usará palette.text.disabled por defecto si no se especifica)
                 },
            }
          },
        },
      },
    },
     MuiLink: {
      styleOverrides: {
        root: {
          color: SECONDARY_COLOR, 
          textDecoration: 'none', 
          '&:hover': {
            textDecoration: 'underline', 
            textDecorationColor: SECONDARY_COLOR, 
          }
        },
      },
    },
    MuiAlert: { 
        styleOverrides: {
            root: {
                borderRadius: 8, 
            },
            standardError: { 
                backgroundColor: `rgba(${parseInt(ERROR_COLOR.slice(1, 3), 16)}, ${parseInt(ERROR_COLOR.slice(3, 5), 16)}, ${parseInt(ERROR_COLOR.slice(5, 7), 16)}, 0.1)`, 
                color: ERROR_COLOR, 
                border: `1px solid ${ERROR_COLOR}`, 
            },
            // Añadimos estilo para alerta de éxito
            standardSuccess: {
                backgroundColor: `rgba(${parseInt(SUCCESS_COLOR.slice(1, 3), 16)}, ${parseInt(SUCCESS_COLOR.slice(3, 5), 16)}, ${parseInt(SUCCESS_COLOR.slice(5, 7), 16)}, 0.2)`, // Fondo verde suave 
                color: '#a5d6a7', // Texto verde claro (ajustar si es necesario)
                border: `1px solid #a5d6a7`, // Borde verde claro
                 '& .MuiAlert-icon': { // Color del icono
                    color: '#a5d6a7', // Ajustar si es necesario
                }
            }
        }
    },
    MuiCircularProgress: { 
        styleOverrides: {
            root: {
                // Heredará el color del texto del botón (blanco)
            }
        }
    },
    // Añadimos estilos para el Stepper para que se vea bien en oscuro
    MuiStepLabel: {
        styleOverrides: {
            label: {
                color: TEXT_SECONDARY, // Color por defecto de la etiqueta
                '&.Mui-active': {
                    color: TEXT_PRIMARY, // Color activo
                    fontWeight: 'bold',
                },
                '&.Mui-completed': {
                    color: TEXT_PRIMARY, // Color completado
                    fontWeight: 'normal',
                },
            },
        }
    },
    MuiStepIcon: {
        styleOverrides: {
            root: {
                color: TEXT_SECONDARY, // Color por defecto del icono
                '&.Mui-active': {
                    color: PRIMARY_COLOR, // Color activo (azul primario)
                },
                '&.Mui-completed': {
                    color: SUCCESS_COLOR, // Color completado (verde éxito)
                },
            },
        }
    }
  },
});

export default theme;