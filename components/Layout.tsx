import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import BackButton from 'utils/BackButton';
import backgroundImage from '../assets/background-min.jpg';
export default function Home({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Pizza Base</title>
        <meta
          name='description'
          content='Pizza colliseum, pizza forum, pizza information.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      {router.pathname !== '/' && <BackButton></BackButton>}
      <main>{children}</main>
    </>
  );
}
