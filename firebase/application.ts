import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import {
  ImageObject,
  PizzaObject,
  BrandObject,
  BrandData,
  SinglePizza,
  CountryData,
  CountryObject,
  PizzaFormInput,
} from '../lib/types';
const firebaseConfig = {
  // apiKey: process.env.FIRE_API_KEY <-------throws an error with authentication, works with hardcoding,
  apiKey: 'AIzaSyCDlQja-OMDJOXrMgx8qheIolHHE7ypErs',
  authDomain: 'react-df350.firebaseapp.com',
  databaseURL: 'https://react-df350.firebaseio.com',
  projectId: 'react-df350',
  storageBucket: 'react-df350.appspot.com',
  messagingSenderId: process.env.FIRE_SENDER_ID,
  appId: process.env.FIRE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const addData = async (
  pizzaData: PizzaFormInput
): Promise<{ status: boolean }> => {
  try {
    const { brandName, countryName } = pizzaData;
    const dbRef = doc(db, 'pizzas', countryName);

    const pizzaItem: PizzaObject = {
      name: pizzaData.pizzaName,
      price: pizzaData.price,
      creator: pizzaData.pizzaCreator,
      imageList: pizzaData.imageList,
    };

    const pizzaList = { [pizzaData.pizzaName]: pizzaItem };

    const brandData: BrandData = { name: brandName };
    const countryData: CountryData = { name: countryName };

    const brandItem: BrandObject = {
      info: brandData,
      pizzaList,
    };

    const countryItem: CountryObject = {
      info: countryData,
      brandsList: { [brandName]: brandItem },
    };
    //Check for country
    const alreadyInDB = await getDataOfSingleCountry(countryName);
    console.log('already in db');
    console.log(alreadyInDB);
    if (alreadyInDB) {
      try {
        //Check if brand already exists
        if (alreadyInDB.brandsList[brandName]) {
          //add pizza to existing brand   * WORKS *
          console.log('adding new pizza');
          await updateDoc(dbRef, {
            [`brandsList.${brandName}.pizzaList.${pizzaItem.name}`]: pizzaItem,
          });
          return { status: true };
        } else {
          //add new brand with new pizza *  WORKS *
          console.log('adding new brand');
          await updateDoc(dbRef, {
            [`brandsList.${brandName}`]: brandItem,
          });

          return { status: true };
        }
      } catch (e) {
        throw new Error('Brand couldnt be updated with new pizza');
      }
    } else {
      //Add new document *countryName* collection
      await setDoc(dbRef, countryItem, {
        merge: false,
      });

      return { status: true };
    }
  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const getDataOfSinglePizza = async (
  countryName: string,
  brandName: string,
  pizzaName: string
) => {
  try {
    const docRef = doc(db, 'pizzas', countryName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const countryItem = docSnap.data();
      const requestedBrand = countryItem.brandsList[brandName];
      //Find the specific pizza
      const requestedPizza: PizzaObject = requestedBrand.pizzaList[pizzaName];
      if (!requestedBrand || !requestedPizza)
        throw new Error('Pizza not found');
      requestedBrand.pizzaList = { [pizzaName]: requestedPizza };
      //Return new brand object like item with requested pizza as the only pizza in the list (UN-SURE)
      const response: CountryObject = {
        info: countryItem.info,
        brandsList: { [brandName]: requestedBrand },
      };
      console.log(response);
      return response;
    } else {
      console.log('No such document!');
    }
  } catch (e) {
    console.log(e);
    throw new Error('Could not connect to database');
  }
};
export const updatePizza = async (
  countryName: string,
  brandName: string,
  pizzaName: string,
  newImage: ImageObject
) => {
  try {
    const countryRef = doc(db, 'pizzas', countryName);

    const pizzaCountry = await getDataOfSingleCountry(countryName);

    if (countryRef && pizzaCountry && newImage) {
      const parentBrand = pizzaCountry.brandsList[brandName];
      // Iterate through all pizzas in that brand, add image to the pizza with matching name
      const oldpizza = parentBrand.pizzaList[pizzaName];
      const oldImageList = parentBrand.pizzaList[pizzaName].imageList;
      const newImageList = [...oldImageList, newImage];

      const updatedList = {
        ...pizzaCountry.brandsList[brandName].pizzaList,
        [pizzaName]: { ...oldpizza, imageList: newImageList },
      };
      const updatedBrand = {
        ...pizzaCountry.brandsList[brandName],
        pizzaList: updatedList,
      };

      //update brands
      await updateDoc(countryRef, {
        brandsList: {
          [brandName]: updatedBrand,
        },
      });
    }
  } catch (e) {
    console.log(e);
    throw new Error('Could not connect to database');
  }
};
export const getDataOfSingleBrand = async (
  brand: string,
  country: string | null
) => {
  if (!brand) return;
  try {
    const allCountries = await getAllPizzas();
    if (!allCountries) {
      console.log('coudlnt get all countries');
      return;
    }
    let requiredResponse;
    if (country) {
      //If we want to return brand from a specific country
      const requiredCountry: CountryObject | undefined = allCountries.find(
        (countryElement: CountryObject) => countryElement.info.name === country
      );
      if (requiredCountry) {
        requiredResponse = requiredCountry.brandsList[brand];
      }
    } else {
      //otherwise return a list of countries with a list of its brands that is required
      const finalList = allCountries.filter((countryElement: CountryObject) => {
        const countryBrandNames = Object.keys(countryElement.brandsList);
        if (countryBrandNames.includes(brand)) {
          return countryElement;
        }
      });

      requiredResponse = finalList;
    }
    console.log('from filter getsignlebrand');
    console.log(requiredResponse);
    return requiredResponse;
  } catch (e) {
    console.log(e);
  }
};
export const getDataOfSingleCountry = async (country: string) => {
  console.log(country);
  if (!country) return;
  try {
    console.log('getting data...');
    const docRef = doc(db, 'pizzas', country);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('data from getsinglecoutry');
      console.log({ dd: docSnap.data() });
      return docSnap.data() as CountryObject;
    } else {
      console.log('No such document!');
    }
  } catch (e) {
    console.log(e);
  }
};
export const getAllPizzas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pizzas'));
    //Should set type to CountryObject, but for now the doc.data() interferes by adding DocumentData propery, IDK how to avoid it atm
    let countryList: CountryObject[] = [];
    querySnapshot.forEach((doc) => {
      const countryItem = doc.data() as CountryObject;
      countryList.push(countryItem);
    });
    return countryList;
  } catch (error) {
    console.log(error);
  }
};
export const uploadHandler = async (
  file: File,
  brand: string,
  name: string
) => {
  const storageLocation = `${brand}/${name}/${file.name}`;
  const storageRef = ref(storage, storageLocation);
  try {
    const imageReference = await uploadBytes(storageRef, file).then(
      (snapshot) => {
        return {
          ref: snapshot.ref.fullPath,
          timeCreated: snapshot.metadata.timeCreated,
        };
      }
    );
    return imageReference;
  } catch (error) {
    console.log(error);
  }
};
