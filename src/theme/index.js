import React from 'react';
// src/theme/index.js
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#212B36',
      light: '#3e4a56',
      dark: '#171e24'
    },
    secondary: {
      main: '#00AB55',
      light: '#33bc75',
      dark: '#00773b'
    },
    error: {
      main: '#FF4842'
    },
    warning: {
      main: '#FFC107'
    },
    info: {
      main: '#00B8D9'
    },
    success: {
      main: '#54D62C'
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F4F6F8',
          color: '#637381'
        }
      }
    }
  }
});

export default theme;