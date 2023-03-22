import React, { Suspense } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainList from 'components/MainList';
import Layout from '../components/Layout';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import Search from '../components/searchComponent';
import { getAllPizzas, db } from '../firebase/app';
import { BrandObject, CountryObject, PizzaObject } from 'lib/types';
import Loading from 'lib/Loading';
import { lazy } from 'react';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';

const Main = lazy(() => import('../components/mainComponent'));
export default function Home() {
  const [brands, setBrands] = React.useState<BrandObject | null>(null);
  const [brandsDB, setBrandsDB] = React.useState<BrandObject | null>(null);
  const [countries, setCountries] = React.useState<CountryObject[] | null>(
    null
  );
  const [countriesOriginal, setCountriesOriginal] = React.useState<
    CountryObject[]
  >([]);
  const [searchResult, setSearchResult] = React.useState<BrandObject | null>(
    null
  );
  const [searchInput, setSearchInput] = React.useState<{ [x: string]: string }>(
    {
      brand: '',
      name: '',
    }
  );
  const auth = getAuth();
  const user = auth.currentUser;
  React.useEffect(() => {
    const getAllData = async () => {
      const countriesList = await getAllPizzas();
      if (!countriesList) return;
      // setBrandsDB(countriesList.map((country:CountryObject)=>country.brandsList));
      setCountries(countriesList);
      setCountriesOriginal(countriesList);
    };
    getAllData();

    const q = query(collection(db, 'pizzas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated: any = [];
      snapshot.forEach((doc) => updated.push(doc.data()));
      //on addition/modification updates lists
      setBrandsDB(updated);
      setBrands(updated);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const inputController = (e: any) => {
    if (e.target) {
      const key: string = e.target.name;
      const val: string = e.target.value;
      setSearchInput((old) => ({ ...old, [key]: val }));
    }
  };
  // React.useEffect(() => {
  //   const brandInputValue = searchInput.brand;
  //   const nameInputValue = searchInput.name;

  //   //Check for value of ALL option, which would be an empty string
  //   if (!brandInputValue.length) {
  //     //Reset list of all brands to original
  //     setBrands(brandsDB);
  //     //Reset search results
  //     setSearchResult(null);
  //     return;
  //   }
  //   const foundBrandOriginal = brandsDB[brandInputValue];
  //   //Check if new brand has been selected
  //   if (searchResult && brandInputValue !== searchResult?.info.name) {
  //     setSearchInput((previous) => ({ ...previous, name: '' }));
  //   }

  //   //If specific pizza is selected by name
  //   if (searchResult && foundBrandOriginal) {
  //     //Check for value of ALL option, which would be an empty string
  //     if (!nameInputValue.length) {
  //       //Replace brand object(with filtered list) with original unchanged brand object
  //       setBrands(foundBrandOriginal);
  //       //Replace search object(with filtered list) with original unchanged brand object
  //       setSearchResult(foundBrandOriginal);
  //       return;
  //     }
  //     const requiredPizza = foundBrandOriginal.pizzaList[nameInputValue];
  //     const newResult = { ...searchResult, pizzaList: requiredPizza };
  //     // const listWithRequiredPizza = foundBrandOriginal.pizzaList.filter(
  //     //   (pizza: PizzaObject) => pizza.name === nameInputValue
  //     // );
  //     // const newResult = { ...searchResult, pizzaList: listWithRequiredPizza };
  //     //Update brands pizza list for display with that single pizza in the list

  //     setBrands(newResult);
  //     return;
  //   }
  //   //Put brand as main result to form a list for pizza names
  //   foundBrandOriginal && setSearchResult(foundBrandOriginal);
  //   //Leave only the requested brand in the list to show filtered list
  //   foundBrandOriginal && setBrands(foundBrandOriginal);
  // }, [searchInput]);

  return (
    <Layout>
      {user ? (
        <Link href={'/pizzas/'}>
          <Button>Create a pizza</Button>
        </Link>
      ) : (
        <h2>
          Can't find what you wanted? Register or sign to create a new Pizza.{' '}
        </h2>
      )}
      {countries ? (
        <>
          <Main countryObjects={countries}></Main>
        </>
      ) : (
        <div>no</div>
      )}
      {/* {brands.length <= 0 ? (
        <div>No pizzas in the Pizzabase yet.</div>
      ) : (
        <>
          <Search
            onChangeController={inputController}
            brandValue={searchInput.brand}
            nameValue={searchInput.name}
            brandList={brands}
            selectedBrand={searchResult}
          />

          <Suspense fallback={<Loading />}>
            <Main brandObjects={brands} />
          </Suspense>
        </>
      )} */}
    </Layout>
  );
}
