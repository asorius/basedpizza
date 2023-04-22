import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import base from '../assets/base.svg';
import Link from 'next/link';
import Image from 'next/image';
import UserCard from './userCard';
export default function Navbar() {
  return (
    <Box color='secondary' sx={{ flexGrow: 1 }} id='back-to-top-anchor'>
      <Container>
        <Grid container>
          <Grid item xs={4} lg={9}>
            <Link href='/'>
              <h2>PizzaBase 🍕</h2>
              {/* <Image src={base} alt='image of pizza base' /> */}
            </Link>{' '}
          </Grid>
          <Grid item xs={4} lg={3}>
            <UserCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
