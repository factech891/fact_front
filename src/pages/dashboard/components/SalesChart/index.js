// src/pages/dashboard/components/SalesChart/index.js
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { ShowChart, MoreVert } from '@mui/icons-material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { CHART_STYLES } from '../../constants/dashboardConstants';
import { chartConfig } from './config';

const SalesChart = ({ data }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChart color="primary" />
            <Typography variant="h6">
              Tendencia de Ventas
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid {...chartConfig.gridOptions} />
              <XAxis 
                dataKey="mes" 
                {...chartConfig.axisOptions}
              />
              <YAxis {...chartConfig.axisOptions} />
              <Tooltip {...CHART_STYLES.tooltip} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ventas" 
                {...chartConfig.lineOptions.sales}
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                {...chartConfig.lineOptions.target}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;