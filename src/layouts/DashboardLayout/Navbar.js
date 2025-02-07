// src/layouts/DashboardLayout/Navbar.js
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SIDEBAR_WIDTH } from './constants';

export const Navbar = ({ onMenuClick, open }) => (
  <AppBar
    position="fixed"
    sx={{
      width: { sm: open ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%' },
      ml: { sm: open ? `${SIDEBAR_WIDTH}px` : 0 },
      bgcolor: 'background.paper',
      color: 'text.primary',
      boxShadow: 1
    }}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        onClick={onMenuClick}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        Sistema de Facturación
      </Typography>
    </Toolbar>
  </AppBar>
);