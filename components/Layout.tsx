import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
export default function Home({ children }: { children?: React.ReactNode }) {
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
      <main>{children}</main>
    </>
  );
}
