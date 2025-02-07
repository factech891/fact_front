// src/layouts/DashboardLayout/index.js
import { useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import theme from '../../theme';
import { SIDEBAR_WIDTH } from './constants';

export const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Navbar open={open} onMenuClick={() => setOpen(!open)} />
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            ml: open ? `${SIDEBAR_WIDTH}px` : 0,
            mt: 8,
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};
