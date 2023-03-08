import Head from 'next/head';
import { AdditionForm } from '../components/AdditionForm';
import AuthRoute from '../components/AuthRoute';
import { getAllPizzas } from '../firebase/app';
import {} from '../lib/types';
import MainList from '../components/MainList';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import React from 'react';
export interface ImageObject {
  creator: string;
  imageRef: string;
  timeStamp: string;
}
export interface PizzaObject {
  name: string;
  creator: string;
  price: number;
  images: ImageObject[] | [];
}
export interface BrandObject {
  name: string;
  pizzas: PizzaObject[];
}
export default function Home() {
  const [brands, setBrandData] = React.useState<any>([]);
  React.useEffect(() => {
    const getAllData = async () => {
      const brandsList = await getAllPizzas();
      setBrandData(brandsList);
    };
    getAllData();
  }, []);
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
      <main>
        <Container>
          <AdditionForm></AdditionForm>
          {brands && <MainList brandObjects={brands} />}
        </Container>
      </main>
    </>
  );
}
