import React from 'react';
import Link from 'next/link';

import { Box, Breadcrumbs, Container, Typography } from '@mui/material';

import GrainIcon from '@mui/icons-material/Grain';
import HomeIcon from '@mui/icons-material/Home';

const breadcrumbs = ({ children }) => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2.5,
          backgroundColor: '#f26d3e',
        }}
      >
        <Container maxWidth="xl">
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: '#FFFFFF', fontSize: '20px' }}>
            <Link href="/dashboard" passHref>
              <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: '20px' }} color="#FFFFFF">
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                হোম
              </Typography>
            </Link>
            <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: '20px' }} color="#FFFFFF">
              <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              {children}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>
    </>
  );
};

export default breadcrumbs;
