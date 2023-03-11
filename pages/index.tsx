import React from 'react';
import Head from 'next/head';
import { AdditionForm } from '../components/AdditionForm';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainList from 'components/MainList';
import Layout from '../components/Layout';
import { getAuth, signOut } from 'firebase/auth';
import { app, getAllPizzas } from '../firebase/app';
export default function Home() {
  const [brands, setBrandData] = React.useState<any>(null);
  const auth = getAuth(app);
  const user = auth.currentUser;
  React.useEffect(() => {
    const getAllData = async () => {
      const brandsList = await getAllPizzas();
      setBrandData(brandsList);
    };
    getAllData();
  }, []);
  return (
    <Layout>
      {user ? (
        <AdditionForm></AdditionForm>
      ) : (
        <h2>
          To create or upload your photo you must register or sign in first.{' '}
        </h2>
      )}
      {brands ? <MainList brandObjects={brands} /> : <h3>'Loading...'</h3>}
    </Layout>
  );
}
