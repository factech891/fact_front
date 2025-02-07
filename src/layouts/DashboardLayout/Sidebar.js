// src/layouts/DashboardLayout/Sidebar.js
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import { SIDEBAR_WIDTH } from './constants';

const menuItems = [
  { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { title: 'Facturas', path: '/invoices', icon: <ReceiptIcon /> },
  { title: 'Clientes', path: '/clients', icon: <PeopleIcon /> },
  { title: 'Productos', path: '/products', icon: <InventoryIcon /> }
];

export const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const content = (
    <Box sx={{ height: '100%', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: 'common.white', fontWeight: 'bold' }}>
          FACTURACIÓN
        </Typography>
      </Box>

      <List>
        {menuItems.map(({ title, path, icon }) => {
          const isActive = location.pathname === path;

          return (
            <ListItem key={title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(path);
                  onClose?.();
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'common.white', minWidth: 40 }}>
                  {icon}
                </ListItemIcon>
                <ListItemText 
                  primary={title}
                  primaryTypographyProps={{
                    sx: { 
                      color: 'common.white',
                      fontWeight: isActive ? 600 : 400
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        variant="persistent"
        PaperProps={{
          sx: {
            width: SIDEBAR_WIDTH,
            border: 'none',
            boxShadow: 3
          }
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
};