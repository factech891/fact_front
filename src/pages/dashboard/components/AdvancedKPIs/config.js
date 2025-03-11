// Datos de KPIs según el rango de tiempo seleccionado
export const KPI_DATA = {
    daily: {
      averageInvoice: 750,
      averageInvoiceChange: 2.5,
      conversionRate: 15.2,
      conversionRateChange: 1.1,
      averagePaymentDays: 21,
      averagePaymentDaysChange: -0.5,
      profitMargin: 22.8,
      profitMarginChange: 0.8,
      revenueExpenseData: [
        { name: 'Lun', ingresos: 1200, gastos: 800, beneficio: 400 },
        { name: 'Mar', ingresos: 1100, gastos: 750, beneficio: 350 },
        { name: 'Mié', ingresos: 1300, gastos: 880, beneficio: 420 },
        { name: 'Jue', ingresos: 1250, gastos: 820, beneficio: 430 },
        { name: 'Vie', ingresos: 1400, gastos: 950, beneficio: 450 },
        { name: 'Sáb', ingresos: 900, gastos: 620, beneficio: 280 },
        { name: 'Dom', ingresos: 700, gastos: 480, beneficio: 220 }
      ]
    },
    
    weekly: {
      averageInvoice: 4200,
      averageInvoiceChange: 3.8,
      conversionRate: 16.5,
      conversionRateChange: 1.8,
      averagePaymentDays: 18,
      averagePaymentDaysChange: -1.2,
      profitMargin: 23.5,
      profitMarginChange: 1.5,
      revenueExpenseData: [
        { name: 'Sem 1', ingresos: 8500, gastos: 5700, beneficio: 2800 },
        { name: 'Sem 2', ingresos: 9200, gastos: 6100, beneficio: 3100 },
        { name: 'Sem 3', ingresos: 8800, gastos: 5900, beneficio: 2900 },
        { name: 'Sem 4', ingresos: 9500, gastos: 6300, beneficio: 3200 }
      ]
    },
    
    monthly: {
      averageInvoice: 17500,
      averageInvoiceChange: 4.2,
      conversionRate: 18.3,
      conversionRateChange: 2.3,
      averagePaymentDays: 15,
      averagePaymentDaysChange: -2.5,
      profitMargin: 24.7,
      profitMarginChange: 2.1,
      revenueExpenseData: [
        { name: 'Ene', ingresos: 32000, gastos: 22000, beneficio: 10000 },
        { name: 'Feb', ingresos: 28000, gastos: 19000, beneficio: 9000 },
        { name: 'Mar', ingresos: 35000, gastos: 24000, beneficio: 11000 },
        { name: 'Abr', ingresos: 33000, gastos: 23000, beneficio: 10000 },
        { name: 'May', ingresos: 38000, gastos: 26000, beneficio: 12000 },
        { name: 'Jun', ingresos: 36000, gastos: 25000, beneficio: 11000 }
      ]
    },
    
    quarterly: {
      averageInvoice: 52000,
      averageInvoiceChange: 5.6,
      conversionRate: 19.5,
      conversionRateChange: 3.2,
      averagePaymentDays: 14,
      averagePaymentDaysChange: -3.8,
      profitMargin: 26.2,
      profitMarginChange: 2.8,
      revenueExpenseData: [
        { name: 'Q1 2024', ingresos: 95000, gastos: 65000, beneficio: 30000 },
        { name: 'Q2 2024', ingresos: 107000, gastos: 74000, beneficio: 33000 },
        { name: 'Q3 2024', ingresos: 118000, gastos: 82000, beneficio: 36000 },
        { name: 'Q4 2024', ingresos: 132000, gastos: 91000, beneficio: 41000 },
        { name: 'Q1 2025', ingresos: 125000, gastos: 87000, beneficio: 38000 },
        { name: 'Q2 2025', ingresos: 140000, gastos: 97000, beneficio: 43000 }
      ]
    },
    
    yearly: {
      averageInvoice: 210000,
      averageInvoiceChange: 7.8,
      conversionRate: 21.5,
      conversionRateChange: 4.5,
      averagePaymentDays: 12,
      averagePaymentDaysChange: -5.2,
      profitMargin: 28.3,
      profitMarginChange: 3.5,
      revenueExpenseData: [
        { name: '2022', ingresos: 380000, gastos: 270000, beneficio: 110000 },
        { name: '2023', ingresos: 420000, gastos: 295000, beneficio: 125000 },
        { name: '2024', ingresos: 452000, gastos: 315000, beneficio: 137000 },
        { name: '2025 YTD', ingresos: 265000, gastos: 184000, beneficio: 81000 }
      ]
    }
  };