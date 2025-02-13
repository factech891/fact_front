// src/pages/dashboard/components/ProductDistribution/config.js
export const pieChartConfig = {
    colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
    pieOptions: {
      cx: "50%",
      cy: "50%",
      innerRadius: 60,
      outerRadius: 80,
      paddingAngle: 5,
      dataKey: "value"
    },
    legendOptions: {
      verticalAlign: "bottom",
      height: 36
    }
  };