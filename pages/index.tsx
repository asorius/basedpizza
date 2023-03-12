import React from 'react';
import Head from 'next/head';
import { AdditionForm } from '../components/AdditionForm';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainList from 'components/MainList';
import Layout from '../components/Layout';
import { getAuth } from 'firebase/auth';
import Search from '../components/searchComponent';
import { app, getAllPizzas } from '../firebase/app';
import { BrandObject, PizzaObject } from 'lib/types';
export default function Home() {
  const [brands, setBrands] = React.useState<BrandObject[]>([]);
  const [brandsDB, setBrandsDB] = React.useState<BrandObject[]>([]);
  const [searchResult, setSearchResult] = React.useState<BrandObject | null>(
    null
  );
  const [searchInput, setSearchInput] = React.useState<{ [x: string]: string }>(
    {
      brand: '',
      name: '',
    }
  );
  const auth = getAuth(app);
  const user = auth.currentUser;
  React.useEffect(() => {
    const getAllData = async () => {
      const brandsList = await getAllPizzas();
      if (!brandsList) return;
      setBrands(brandsList);
      setBrandsDB(brandsList);
    };
    getAllData();
  }, []);
  const inputController = (e: any) => {
    if (e.target) {
      const key: string = e.target.name;
      const val: string = e.target.value;
      setSearchInput((old) => ({ ...old, [key]: val }));
    }
  };
  React.useEffect(() => {
    const brandInputValue = searchInput.brand;
    const nameInputValue = searchInput.name;

    //Check for value of ALL option, which would be an empty string
    if (!brandInputValue.length) {
      //Reset list of all brands to original
      setBrands(brandsDB);
      //Reset search results
      setSearchResult(null);
      return;
    }
    const foundBrandOriginal = brandsDB.find(
      (brand: BrandObject) => brand.brandInfo.brandName === brandInputValue
    );
    //Check if new brand has been selected
    if (searchResult && brandInputValue !== searchResult?.brandInfo.brandName) {
      setSearchInput((previous) => ({ ...previous, name: '' }));
    }

    //If specific pizza is selected by name
    if (searchResult && foundBrandOriginal) {
      //Check for value of ALL option, which would be an empty string
      if (!nameInputValue.length) {
        //Replace brand object(with filtered list) with original unchanged brand object
        setBrands([foundBrandOriginal]);
        //Replace search object(with filtered list) with original unchanged brand object
        setSearchResult(foundBrandOriginal);
        return;
      }
      const listWithRequiredPizza = foundBrandOriginal.pizzaList.filter(
        (pizza: PizzaObject) => pizza.pizzaName === nameInputValue
      );
      const newResult = { ...searchResult, pizzaList: listWithRequiredPizza };
      //Update brands pizza list for display with that single pizza in the list
      setBrands([newResult]);
      return;
    }
    //Put brand as main result to form a list for pizza names
    foundBrandOriginal && setSearchResult(foundBrandOriginal);
    //Leave only the requested brand in the list to show filtered list
    foundBrandOriginal && setBrands([foundBrandOriginal]);
  }, [searchInput]);
  return (
    <Layout>
      {/* MOVE CREATION FORM TO A NEW ROUTE / SEARCH DOES NOT FILTER TO A SINGLE PIZZA ITEM / USER ACTIONS STOPPED REROUTING */}
      {user ? (
        <AdditionForm></AdditionForm>
      ) : (
        <h2>
          To create or upload your photo you must register or sign in first.{' '}
        </h2>
      )}
      {brands.length > 0 && (
        <Search
          onChangeController={inputController}
          brandValue={searchInput.brand}
          nameValue={searchInput.name}
          brandList={brands}
          selectedBrand={searchResult}
        />
      )}
      {brands ? <MainList brandObjects={brands} /> : <h3>'Loading...'</h3>}
    </Layout>
  );
}
