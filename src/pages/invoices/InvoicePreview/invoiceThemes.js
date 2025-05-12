// src/pages/invoices/InvoicePreview/invoiceThemes.js
export const invoiceThemes = {
  // Nuevo tema para impresión económica
  print: {
    primary: '#000000',    // Negro puro para texto
    secondary: '#555555',  // Gris oscuro para elementos secundarios
    gradient: 'none',      // Sin gradiente
    text: {
      primary: '#000000',  // Texto principal en negro
      secondary: '#555555' // Texto secundario en gris oscuro
    },
    border: '#aaaaaa',     // Bordes en gris medio
    background: {
      primary: '#ffffff',  // Fondo blanco
      secondary: '#ffffff' // Fondo secundario también blanco
    },
    fontSize: {
      title: '22px',
      subtitle: '16px',
      body: '13px',
      small: '12px'
    },
    printMode: true,  // Flag especial para identificar el modo impresión
  },
  modern: {
    primary: '#002855',
    secondary: '#004a9f',
    gradient: 'linear-gradient(135deg, #002855 0%, #004a9f 100%)',
    text: {
      primary: '#2c3e50',
      secondary: '#4a5568'
    },
    border: '#e0e0e7',
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa'
    },
    fontSize: {
      title: '22px',
      subtitle: '16px',
      body: '13px',
      small: '12px'
    }
  },
  classic: {
    primary: '#2C3E50',
    secondary: '#34495E',
    gradient: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    text: {
      primary: '#333333',
      secondary: '#666666'
    },
    border: '#d1d5db',
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb'
    },
    fontSize: {
      title: '24px',
      subtitle: '18px',
      body: '14px',
      small: '12px'
    }
  },
  minimal: {
    primary: '#1A1A1A',
    secondary: '#333333',
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)',
    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A'
    },
    border: '#e5e5e5',
    background: {
      primary: '#ffffff',
      secondary: '#fafafa'
    },
    fontSize: {
      title: '20px',
      subtitle: '15px',
      body: '12px',
      small: '11px'
    }
  },
  professional: {
    primary: '#0A4D68',
    secondary: '#088395',
    gradient: 'linear-gradient(135deg, #0A4D68 0%, #088395 100%)',
    text: {
      primary: '#1e293b',
      secondary: '#475569'
    },
    border: '#cbd5e1',
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc'
    },
    fontSize: {
      title: '23px',
      subtitle: '17px',
      body: '13px',
      small: '12px'
    }
  }
};