// src/pages/dashboard/components/SummaryCard/index.js
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const SummaryCard = ({ title, value, icon: Icon, trend, color = 'primary', onClick }) => (
  <Card 
    sx={{ 
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}
    onClick={onClick}
  >
    <CardContent>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={8}>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {trend > 0 ? (
                <ArrowUpward color="success" fontSize="small" />
              ) : (
                <ArrowDownward color="error" fontSize="small" />
              )}
              <Typography 
                variant="body2"
                color={trend > 0 ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={4}>
          <Box 
            sx={{ 
              bgcolor: `${color}.lighter`,
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1
            }}
          >
            <Icon sx={{ 
              fontSize: 32, 
              color: `${color}.main`,
              filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
            }} />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SummaryCard;