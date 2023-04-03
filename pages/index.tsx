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
import { BrandObject, BrandsList, CountryObject, PizzaObject } from 'lib/types';
import Loading from 'lib/Loading';
import { lazy } from 'react';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
const getBrands = (countries: CountryObject[]) => {
  const list = countries.reduce(
    (accumulator: Set<string>, country: CountryObject) => {
      const brands = Object.keys(country.brandsList);
      brands.forEach((key: string) => accumulator.add(key));
      return accumulator;
    },
    new Set()
  );

  const arrayed = Array.from(list);
  return arrayed;
};
const Main = lazy(() => import('../components/mainComponent'));
export default function Home() {
  const [displayCountries, setDisplayCountries] = React.useState<
    CountryObject[] | null
  >(null);
  const [countriesOriginal, setCountriesOriginal] = React.useState<
    CountryObject[]
  >([]);
  const [searchResult, setSearchResult] = React.useState<CountryObject | null>(
    null
  );
  const [searchInput, setSearchInput] = React.useState<{ [x: string]: string }>(
    {
      country: '',
      brand: '',
      name: '',
    }
  );
  const [displayBrand, setDisplayBrand] = React.useState<BrandObject | null>(
    null
  );
  const [brandNamesOG, setBrandNames] = React.useState<string[] | null>(null);
  const [brandSearchNames, setBrandSearchNames] = React.useState<
    string[] | null
  >(null);
  const auth = getAuth();
  const user = auth.currentUser;
  React.useEffect(() => {
    const getAllData = async () => {
      const countriesList = await getAllPizzas();
      if (!countriesList) return;
      const brandsList = countriesList.reduce(
        (accumulator: Set<string>, country: CountryObject) => {
          const brands = Object.keys(country.brandsList);
          brands.forEach((key: string) => accumulator.add(key));
          return accumulator;
        },
        new Set()
      );

      const arrayed = Array.from(brandsList);
      setBrandNames(arrayed);
      setBrandSearchNames(arrayed);
      setDisplayCountries(countriesList);
      setCountriesOriginal(countriesList);
    };
    getAllData();
    const q = query(collection(db, 'pizzas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated: any = [];
      snapshot.forEach((doc) => updated.push(doc.data()));
      //on addition/modification updates lists
      setCountriesOriginal(updated);
      setDisplayCountries(updated);
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
  React.useEffect(() => {
    const countryInputValue = searchInput.country;
    const brandInputValue = searchInput.brand;
    const nameInputValue = searchInput.name;

    // if (!countryInputValue.length) {
    //   //If user hasn't selected a specific country, reset
    //   setSearchResult(null);
    //   return;
    // }

    //Check for value of ALL option, which would be an empty string
    // if (!brandInputValue.length) {
    //   //Reset list of all brands to original
    //   setBrands(brandsDB);
    //   //Reset search results
    //   setSearchResult(null);
    //   return;
    // }
    // const foundBrandOriginal = brandsDB[brandInputValue];
    if (!displayCountries) {
      return;
    }
    if (countryInputValue.length === 0) {
      setDisplayCountries(countriesOriginal);
    }
    if (countryInputValue.length > 0) {
      // if there are any countries to display at all and countries input is NOT set to ALL
      const foundCountry = countriesOriginal.find(
        (country: CountryObject) =>
          country.info.name.toLocaleLowerCase() ===
          countryInputValue.toLocaleLowerCase()
      );
      if (foundCountry) {
        setDisplayCountries([foundCountry]);
        setBrandSearchNames(Object.keys(foundCountry.brandsList));
      }
      if (brandInputValue.length > 0 && foundCountry) {
        const selectedBrand = foundCountry.brandsList[brandInputValue];
        setDisplayBrand(selectedBrand);
      }
      if (
        nameInputValue.length > 0 &&
        brandInputValue.length > 0 &&
        foundCountry
      ) {
        // const selectedBrand = foundCountry.brandsList[brandInputValue];
        // setDisplayBrand(selectedBrand);
      }
      return;
    }
    if (brandInputValue.length > 0) {
      //loop through countries and leave the ones that have that brand
      const filtered = displayCountries.filter((country: CountryObject) =>
        country.brandsList.hasOwnProperty(brandInputValue)
      );
      console.log(filtered);
      setDisplayCountries(filtered);
    }
    // // Check if new brand has been selected
    // if (
    //   brandInputValue.length > 0 &&
    //   countryInputValue.length > 0 &&
    //   displayCountries
    // ) {
    //   const newBrands = getBrands(displayCountries);
    //   setBrandSearchNames(newBrands);
    // }

    // //If specific pizza is selected by name
    // if (searchResult && foundBrandOriginal) {
    //   //Check for value of ALL option, which would be an empty string
    //   if (!nameInputValue.length) {
    //     //Replace brand object(with filtered list) with original unchanged brand object
    //     setBrands(foundBrandOriginal);
    //     //Replace search object(with filtered list) with original unchanged brand object
    //     setSearchResult(foundBrandOriginal);
    //     return;
    //   }
    //   const requiredPizza = foundBrandOriginal.pizzaList[nameInputValue];
    //   const newResult = { ...searchResult, pizzaList: requiredPizza };
    //   // const listWithRequiredPizza = foundBrandOriginal.pizzaList.filter(
    //   //   (pizza: PizzaObject) => pizza.name === nameInputValue
    //   // );
    //   // const newResult = { ...searchResult, pizzaList: listWithRequiredPizza };
    //   //Update brands pizza list for display with that single pizza in the list

    //   setBrands(newResult);
    //   return;
    // }
    // //Put brand as main result to form a list for pizza names
    // foundBrandOriginal && setSearchResult(foundBrandOriginal);
    // //Leave only the requested brand in the list to show filtered list
    // foundBrandOriginal && setBrands(foundBrandOriginal);
  }, [searchInput]);

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
      {displayCountries?.length ? (
        <>
          <Search
            onChangeController={inputController}
            brandValue={searchInput.brand}
            nameValue={searchInput.name}
            selectedCountries={displayCountries}
            brandsList={brandSearchNames}
            selectedBrand={displayBrand}
          />
          <Main countryObjects={displayCountries}></Main>
        </>
      ) : (
        <div>No pizzas in the Pizzabase yet.</div>
      )}
    </Layout>
  );
}
