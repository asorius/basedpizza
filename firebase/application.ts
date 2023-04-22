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
  CountryData,
  CountryObject,
  PizzaFormInput,
} from '../utils/types';
// console.log(process.env);
const firebaseConfig = {
  // apiKey: process.env.FIRE_API_KEY <-------throws an error with authentication, works with hardcoding,
  apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
  // AIzaSyCDlQja-OMDJOXrMgx8qheIolHHE7ypErs
  // apiKey: 'AIzaSyCDlQja-OMDJOXrMgx8qheIolHHE7ypErs',
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
    //Construct pizza item
    const pizzaItem: PizzaObject = {
      name: pizzaData.pizzaName,
      price: pizzaData.price,
      creator: pizzaData.pizzaCreator,
      imageList: pizzaData.imageList,
    };
    //Add pizza name as a new property
    const pizzaList = { [pizzaData.pizzaName]: pizzaItem };
    //Set brand name
    const brandData: BrandData = { name: brandName };
    //Set country name
    const countryData: CountryData = { name: countryName };
    //Construct brand item
    const brandItem: BrandObject = {
      info: brandData,
      pizzaList,
    };

    const countryItem: CountryObject = {
      info: countryData,
      brandsList: { [brandName]: brandItem },
    };
    //Check if country already exists in database
    const countryFromDB = await getDataOfSingleCountry(countryName);
    if (countryFromDB) {
      try {
        //Check if brand already exists
        if (countryFromDB.brandsList[brandName]) {
          //Add pizza to existing brand

          await updateDoc(dbRef, {
            [`brandsList.${brandName}.pizzaList.${pizzaItem.name}`]: pizzaItem,
          });
          return { status: true };
        } else {
          //There's no brand with such name
          //Add *NEW* Brand with *NEW* pizza
          await updateDoc(dbRef, {
            [`brandsList.${brandName}`]: brandItem,
          });
          return { status: true };
        }
      } catch (e) {
        throw new Error('Brand couldnt be updated with new pizza');
      }
    } else {
      //Create a new collection of *countryName*
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
      if (!requestedBrand || !requestedPizza) {
        throw new Error('Pizza not found');
      }
      requestedBrand.pizzaList = { [pizzaName]: requestedPizza };
      //Return *NEW* brand-item-like object with requested pizza as the only pizza in the list (UN-SURE)
      const response: CountryObject = {
        info: countryItem.info,
        brandsList: { [brandName]: requestedBrand },
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
      parentBrand.pizzaList[pizzaName].imageList.push(newImage);

      //Update brands
      await updateDoc(countryRef, {
        brandsList: {
          [brandName]: parentBrand,
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
      console.log('Couldnt get all countries');
      return;
    }
    let response;
    if (country) {
      //If we want to return brand from a specific country
      const requiredCountry: CountryObject | undefined = allCountries.find(
        (countryElement: CountryObject) => countryElement.info.name === country
      );
      if (requiredCountry) {
        response = requiredCountry.brandsList[brand];
      }
    } else {
      //otherwise return a list of countries with a list of its brands that is required
      const finalList = allCountries.filter((countryElement: CountryObject) => {
        const countryBrandNames = Object.keys(countryElement.brandsList);
        if (countryBrandNames.includes(brand)) {
          return countryElement;
        }
      });

      response = finalList;
    }
    return response;
  } catch (e) {
    console.log(e);
  }
};
export const getDataOfSingleCountry = async (country: string) => {
  if (!country) return;
  try {
    const docRef = doc(db, 'pizzas', country);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
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
