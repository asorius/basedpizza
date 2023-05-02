import React, { Suspense } from 'react';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import Layout from '../components/Layout';
import Link from 'next/link';
import Search from '../components/Search';

import { lazy } from 'react';
import Globe from '../components/Map';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { DataContextProvider } from 'context/data/DataContextProvider';
import { userContext } from 'context/user/UserContextProvider';
const Main = lazy(() => import('../components/Main'));
import BackToTop from 'utils/ScrollToTop';
export default function Home() {
  const { user } = userContext();

  return (
    <Layout>
      <Box
        sx={{
          width: '100vw',
          height: '50vh',
          position: 'relative',
          isolation: 'isolate',
          backgroundColor: 'powderblue',
        }}>
        <Container sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute' }}>
            <Typography variant='h1'>Based Pizza</Typography>
            <Typography variant='h4'>
              Search and share pizzas based around the world.{' '}
            </Typography>
          </Box>
        </Container>
        <DataContextProvider>
          <Globe />
        </DataContextProvider>
      </Box>
      <Container>
        {user ? (
          <Box p={4} textAlign='center'>
            <Typography variant='h5' m={4}>
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
      {/* <BackToTop></BackToTop> */}
    </Layout>
  );
}
