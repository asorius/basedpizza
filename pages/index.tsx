import React, { Suspense } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainList from 'components/MainList';
import Layout from '../components/Layout';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import Search from '../components/search';
import { getAllPizzas, db } from '../firebase/application';
import {
  BrandObject,
  BrandsList,
  CountryObject,
  PizzaObject,
} from 'utils/types';
import Loading from 'utils/Loading';
import { lazy } from 'react';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import Globe from '../components/map';
import { Box, Typography } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { WithDataContext } from 'context/data/DataContextProvider';
const Main = lazy(() => import('../components/main'));
export default function Home() {
  const auth = getAuth();
  const user = auth.currentUser;

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
        <WithDataContext>
          <Globe />
        </WithDataContext>
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
          <WithDataContext>
            <Search />
            <Main></Main>
          </WithDataContext>
        </Box>
      </Container>
    </Layout>
  );
}
