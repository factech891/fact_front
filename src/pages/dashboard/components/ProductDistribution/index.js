// src/pages/dashboard/components/ProductDistribution/index.js
import { Box, Card, CardContent, Typography } from '@mui/material';
import { PieChart as PieChartIcon } from '@mui/icons-material';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { CHART_STYLES } from '../../constants/dashboardConstants';
import { pieChartConfig } from './config';

const ProductDistribution = ({ data }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 3 
        }}>
          <PieChartIcon color="primary" />
          <Typography variant="h6">
            Distribución de Ventas
          </Typography>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                {...pieChartConfig.pieOptions}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={pieChartConfig.colors[index % pieChartConfig.colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip {...CHART_STYLES.tooltip} />
              <Legend {...pieChartConfig.legendOptions} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductDistribution;