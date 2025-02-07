// src/pages/dashboard/Dashboard.js
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  TrendingUp, Group, Receipt, Inventory,
  ArrowUpward, ArrowDownward 
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SummaryCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={8}>
          <Typography color="text.secondary" variant="body2">
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
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ fontSize: 32, color: `${color}.main` }} />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Datos de ejemplo - reemplazar con datos reales
  const salesData = [
    { mes: 'Ene', ventas: 4000 },
    { mes: 'Feb', ventas: 3000 },
    { mes: 'Mar', ventas: 5000 },
    { mes: 'Abr', ventas: 4600 },
    { mes: 'May', ventas: 6000 },
    { mes: 'Jun', ventas: 5400 }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Ventas Totales"
            value="$23,000"
            icon={TrendingUp}
            trend={2.5}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Clientes"
            value="85"
            icon={Group}
            trend={-0.8}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Facturas"
            value="132"
            icon={Receipt}
            trend={1.2}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Productos"
            value="45"
            icon={Inventory}
            trend={3.1}
            color="success"
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Ventas Mensuales
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#00AB55" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;