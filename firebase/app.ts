import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
} from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import { ImageObject, PizzaObject, BrandObject, BrandData } from '../lib/types';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

interface BasePizza extends PizzaObject {
  brandName: string;
}
const addData = async (pizzaData: BasePizza) => {
  try {
    const { brandName } = pizzaData;
    const dbRef = doc(db, 'pizzas', brandName);
    const { pizzaName, price, pizzaCreator, imageList }: PizzaObject =
      pizzaData;
    const brandData: BrandData = { brandName };
    const brandItem: BrandObject = {
      brandInfo: brandData,
      pizzaList: [
        {
          pizzaName,
          price,
          pizzaCreator,
          imageList,
        },
      ],
    };
    const addedDoc = await setDoc(dbRef, brandItem, { merge: true });
    return { status: true, data: addedDoc };
  } catch (e) {
    return { status: false };
  }
};

const getDataOfSinglePizza = async (brandName: string, pizzaName: string) => {
  try {
    const docRef = doc(db, 'pizzas', brandName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const brandItem = docSnap.data();
      const requestedPizza: PizzaObject = brandItem.pizzaList.find(
        (pizza: PizzaObject) => pizza.pizzaName === pizzaName
      );
      if (!requestedPizza) throw new Error('Pizza not found');
      //Return new brand object like item with requested pizza as the only pizza in the list (UN-SURE)
      const response: BrandObject = {
        brandInfo: brandItem.brandInfo,
        pizzaList: [requestedPizza],
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
const getDataOfSingleBrand = async (brand: string) => {
  if (!brand) return;
  try {
    const docRef = doc(db, 'pizzas', brand);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // doc.data() is never undefined for query doc snapshots
      // console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  } catch (e) {
    console.log(e);
  }
};
const getAllPizzas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pizzas'));
    let brandList: any[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const brandItem = doc.data();
      brandList.push(brandItem);
    });
    return brandList;
  } catch (error) {
    console.log(error);
  }
};
const uploadHandler = async (file: File, brand: string, name: string) => {
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
export {
  app,
  db,
  storage,
  uploadHandler,
  addData,
  getDataOfSinglePizza,
  getDataOfSingleBrand,
  getAllPizzas,
  firebaseConfig,
};
