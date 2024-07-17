import { Box, Typography, Link } from '@mui/material';
import React from 'react';

function NotFound() {
  return (
    <Box 
      sx={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <Typography 
        variant='h3'
        sx={{
          mb: '.25em'
        }}>404 - Page Not Found</Typography>
      <Typography>You seem lost. Let's get you right 
      <Link href={'/'} underline="none" sx={{ml: '.25em'}}>back.</Link>
      </Typography>
    </Box>
  );
}

export default NotFound;
