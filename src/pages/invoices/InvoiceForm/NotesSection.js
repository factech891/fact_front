import { 
  Box, Grid, Typography, TextField, Paper, Divider
} from '@mui/material';
import { 
  StickyNote2Outlined as NotesIcon,
  ArticleOutlined as TermsIcon
} from '@mui/icons-material';

const NotesSection = ({ notes, terms, onNotesChange, onTermsChange }) => {
  return (
    <Grid container spacing={3}>
      {/* Notas */}
      <Grid item xs={12}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 0, 
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            bgcolor: 'rgba(30,30,30,0.5)'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            p: 2,
            background: 'linear-gradient(90deg, rgba(41,98,255,0.1) 0%, rgba(41,98,255,0) 100%)',
            borderBottom: '1px solid rgba(41,98,255,0.2)'
          }}>
            <NotesIcon sx={{ color: '#2962ff', mr: 1.5 }} />
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
              Notas
            </Typography>
          </Box>
          
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Notas adicionales para el documento"
            value={notes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
            variant="standard"
            sx={{
              '& .MuiInputBase-root': {
                p: 2,
                color: 'white',
              },
              '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
              '& .MuiInput-underline:hover:before': { borderBottomColor: 'transparent' },
              '& .MuiInput-underline:after': { borderBottomColor: '#2962ff' }
            }}
          />
          
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              p: 1.5, 
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.7rem',
              fontStyle: 'italic',
              bgcolor: 'rgba(0,0,0,0.2)'
            }}
          >
            Estas notas aparecerán en la sección de "Notas Importantes" de la factura.
          </Typography>
        </Paper>
      </Grid>

      {/* Términos y Condiciones */}
      <Grid item xs={12}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 0, 
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            bgcolor: 'rgba(30,30,30,0.5)'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            p: 2,
            background: 'linear-gradient(90deg, rgba(41,98,255,0.1) 0%, rgba(41,98,255,0) 100%)',
            borderBottom: '1px solid rgba(41,98,255,0.2)'
          }}>
            <TermsIcon sx={{ color: '#2962ff', mr: 1.5 }} />
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
              Términos y Condiciones
            </Typography>
          </Box>
          
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Términos y condiciones del documento"
            value={terms || ''}
            onChange={(e) => onTermsChange(e.target.value)}
            variant="standard"
            sx={{
              '& .MuiInputBase-root': {
                p: 2,
                color: 'white',
              },
              '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
              '& .MuiInput-underline:hover:before': { borderBottomColor: 'transparent' },
              '& .MuiInput-underline:after': { borderBottomColor: '#2962ff' }
            }}
          />
          
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              p: 1.5, 
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.7rem',
              fontStyle: 'italic',
              bgcolor: 'rgba(0,0,0,0.2)'
            }}
          >
            Estos términos aparecerán en la sección correspondiente de la factura.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NotesSection;