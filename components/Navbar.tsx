import { getAuth } from 'firebase/auth';
import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Link from 'next/link';
import UserActions from './UserActions';
import AuthRoute from './AuthRoute';
export default function Navbar() {
  const auth = getAuth();
  const user = auth.currentUser;
  return (
    <Box color='secondary' sx={{ flexGrow: 1 }}>
      <Container>
        <Grid container>
          <Grid item xs={4} lg={10}>
            <Link href='/'>
              <h2>PizzaBase</h2>
            </Link>{' '}
          </Grid>
          <Grid item xs={4} lg={2}>
            <UserActions />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
