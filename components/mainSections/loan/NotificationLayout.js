import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function NotificationLayout(props) {
  return (
    <Box>
      <AppBar sx={{ zIndex: 111, backgroundColor: '#297F87' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RDCD
          </Typography>
          <Button color="inherit">Welcome</Button>
        </Toolbar>
      </AppBar>
      <Box component="main">
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
