// src/pages/dashboard/components/SalesChart/config.js
export const chartConfig = {
    gridOptions: {
      strokeDasharray: "3 3",
      stroke: "#f5f5f5"
    },
    axisOptions: {
      stroke: "#666",
      tick: { fill: "#666" }
    },
    lineOptions: {
      sales: {
        stroke: "#2196F3",
        strokeWidth: 3,
        dot: { r: 4 },
        activeDot: { r: 6 },
        name: "Ventas"
      },
      target: {
        stroke: "#FF9800",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        dot: false,
        name: "Meta"
      }
    }
  };