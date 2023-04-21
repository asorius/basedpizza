import React, { Suspense } from 'react';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import Layout from '../components/Layout';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import Search from '../components/search';

import { lazy } from 'react';
import Globe from '../components/map';
import { Box, Typography } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { DataContextProvider } from 'context/data/DataContextProvider';
import { userContext } from 'context/user/UserContextProvider';
const Main = lazy(() => import('../components/main'));
export default function Home() {
  const { user } = userContext();

  return (
    <Layout>
      <Box sx={{ width: '100vw', height: '50vh', position: 'relative' }}>
        <Container sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute' }}>
            <Typography variant='h1'>Pizza Base</Typography>
            <Typography variant='h4'>
              Search and share real pizzas around the world.{' '}
            </Typography>
          </Box>
        </Container>
        <DataContextProvider>
          <Globe />
        </DataContextProvider>
      </Box>
      <Container>
        {user ? (
          <Box>
            <Typography variant='h5'>
              Didn't find what you were looking for?
            </Typography>

            <Link href={'/pizzas/'}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                endIcon={<CreateNewFolderIcon />}>
                Add new pizza
              </Button>
            </Link>
          </Box>
        ) : (
          <Typography variant='h5'>
            Can't find what you wanted? Register or sign to create add a new
            Pizza.{' '}
          </Typography>
        )}
        <Box sx={{ textAlign: 'center' }}>
          <DataContextProvider>
            <Search />
            <Main></Main>
          </DataContextProvider>
        </Box>
      </Container>
    </Layout>
  );
}
