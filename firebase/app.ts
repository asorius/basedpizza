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
let app;
if (getApps().length) {
  console.log('App is already running..');
} else {
  app = initializeApp(firebaseConfig);
}
// export app;
export const db = getFirestore(app);
export const storage = getStorage(app);

export const addData = async (pizzaData: PizzaFormInput) => {
  try {
    const { brandName, countryName } = pizzaData;
    const dbRef = doc(db, 'pizzas', countryName);

    const pizzaItem: PizzaObject = {
      name: pizzaData.pizzaName,
      price: pizzaData.price,
      creator: pizzaData.pizzaCreator,
      imageList: pizzaData.imageList,
    };

    const brandData: BrandData = { name: brandName };
    const countryData: CountryData = { name: countryName };
    const brandItem: BrandObject = {
      info: brandData,
      pizzaList: [pizzaItem],
    };
    const countryItem: CountryObject = {
      info: countryData,
      brandsList: [brandItem],
    };
    //Check if brand collection has already been created
    const alreadyInDB = false;
    // const alreadyInDB = await getDataOfSingleBrand(brandName, countryName);

    if (alreadyInDB) {
      // try {
      //   //New list with new pizza item added
      //   const newList = [pizzaItem, ...alreadyInDB.pizzaList];
      //   //update brands collection
      //   await updateDoc(dbRef, {
      //     pizzaList: newList,
      //   });
      //   return { status: true };
      // } catch (e) {
      //   throw new Error('Brand couldnt be updated with new pizza');
      // }
    } else {
      //Add new document *countryName* collection
      await setDoc(dbRef, countryItem, { merge: false });
      return { status: true };
    }
  } catch (e) {
    return { status: false };
  }
};

export const getDataOfSinglePizza = async (
  brandName: string,
  pizzaName: string
) => {
  try {
    const docRef = doc(db, 'pizzas', brandName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const brandItem = docSnap.data();
      //Find the specific pizza
      const requestedPizza: PizzaObject = brandItem.pizzaList.find(
        (pizza: PizzaObject) => pizza.name === pizzaName
      );
      if (!requestedPizza) throw new Error('Pizza not found');
      const pizzaIndex = brandItem.pizzaList.indexOf(requestedPizza);
      //Return new brand object like item with requested pizza as the only pizza in the list (UN-SURE)
      const response: SinglePizza = {
        info: brandItem.info,
        pizzaList: [requestedPizza],
        pizzaIndex,
      };
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
  brandName: string,
  pizzaName: string,
  newImage: ImageObject
) => {
  try {
    console.log({ brandName, pizzaName });
    const docRef = doc(db, 'pizzas', brandName);
    //Get required brand with all pizzas
    const brand = await getDataOfSingleBrand(brandName, null);
    if (brand) {
      //Iterate through all pizzas in that brand, add image to the pizza with matching name
      const newList = brand.pizzaList.map((pizza: PizzaObject) => {
        //If pizza names match and there isn't already that image in there, push it
        if (pizza.name === pizzaName && !pizza.imageList.includes(newImage)) {
          pizza.imageList.push(newImage);
        }
        return pizza;
      });
      //Update brands collection with the new list
      await updateDoc(docRef, {
        pizzaList: newList,
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
    console.log('getting data...');
    const allCountries = await getAllPizzas();
    if (!allCountries) {
      console.log('coudlnt get all countries');
      return;
    }
    let requiredResponse;
    if (country) {
      //If we want to return brand from specific country
      const requiredCountry: CountryObject = allCountries.find(
        (countryElement: CountryObject) => countryElement.info.name === country
      );
      requiredResponse = requiredCountry.brandsList.find(
        (brandElement: BrandObject) => brandElement.info.name === brand
      );
    } else {
      //otherwise return a list of countries with a list of its brands that is required
      const finalList = allCountries.reduce(
        (accumulator, countryElement: CountryObject) => {
          const countryBrandNames = countryElement.brandsList.map(
            (brandElement: BrandObject) => brandElement.info.name
          );
          if (countryBrandNames.includes(brand)) {
            return accumulator.push(countryElement);
          }
        },
        []
      );
      requiredResponse = finalList;
    }
    return requiredResponse;
    //Return specific brand from all countries
    // const docRef = doc(db, 'pizzas', country);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   return docSnap.data();
    // } else {
    //   console.log('No such document!');
    // }
  } catch (e) {
    console.log(e);
  }
};
export const getDataOfSingleCountry = async (country: string) => {
  if (!country) return;
  try {
    console.log('getting data...');
    const docRef = doc(db, 'pizzas', country);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
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
    let countryList: any[] = [];
    querySnapshot.forEach((doc) => {
      const countryItem = doc.data();
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
