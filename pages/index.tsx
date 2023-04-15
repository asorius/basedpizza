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
import { getAllPizzas, db } from '../firebase/application';
import { BrandObject, BrandsList, CountryObject, PizzaObject } from 'lib/types';
import Loading from 'lib/Loading';
import { lazy } from 'react';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';

const Main = lazy(() => import('../components/mainComponent'));
export default function Home() {
  const [displayCountries, setDisplayCountries] = React.useState<
    CountryObject[] | null
  >(null);
  const [countriesOriginal, setCountriesOriginal] = React.useState<
    CountryObject[]
  >([]);
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

    if (!displayCountries) {
      return;
    }
    if (brandInputValue.length > 0 && countryInputValue.length > 0) {
      const filteredByBrand = countriesOriginal.filter(
        (country: CountryObject) =>
          country.brandsList.hasOwnProperty(brandInputValue)
      );
      const foundCountry = filteredByBrand.find(
        (country: CountryObject) =>
          country.info.name.toLowerCase() === countryInputValue.toLowerCase()
      );
      if (foundCountry) {
        setBrandSearchNames(Object.keys(foundCountry.brandsList));
        if (filteredByBrand.length === 1) {
          const selectedBrand = filteredByBrand[0].brandsList[brandInputValue];
          setDisplayBrand(selectedBrand);
          if (nameInputValue.length > 0) {
            // STILL NEED TO FIX FILTERING BY PIZZA NAME
            const pizza = selectedBrand.pizzaList[nameInputValue];
            const newListWithOnePizza: CountryObject = {
              ...foundCountry,
              brandsList: {
                [selectedBrand.info.name]: {
                  ...selectedBrand,
                  pizzaList: { pizza },
                },
              },
            };
            setDisplayCountries([newListWithOnePizza]);
            return;
          }
        }
        setDisplayCountries([foundCountry]);
        return;
      }
      setDisplayCountries(filteredByBrand);
      return;
    } else if (brandInputValue.length > 0) {
      //loop through countries and leave the ones that have that brand
      const filtered = countriesOriginal.filter((country: CountryObject) =>
        country.brandsList.hasOwnProperty(brandInputValue)
      );
      if (filtered.length === 1) {
        const selectedBrand = filtered[0].brandsList[brandInputValue];
        setDisplayBrand(selectedBrand);
      }
      setDisplayCountries(filtered);
      return;
    } else if (countryInputValue.length > 0) {
      // if there are any countries to display at all and countries input is NOT set to ALL
      const foundCountry = countriesOriginal.find(
        (country: CountryObject) =>
          country.info.name.toLowerCase() === countryInputValue.toLowerCase()
      );
      if (foundCountry) {
        setDisplayCountries([foundCountry]);
        setBrandSearchNames(Object.keys(foundCountry.brandsList));
      }
    } else {
      setDisplayCountries(countriesOriginal);
      setDisplayBrand(null);
      setBrandSearchNames(brandNamesOG);
    }
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
