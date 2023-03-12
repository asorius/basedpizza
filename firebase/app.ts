import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import {
  ImageObject,
  PizzaObject,
  BrandObject,
  BrandData,
  SinglePizza,
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

    const pizzaItem: PizzaObject = {
      pizzaName: pizzaData.pizzaName,
      price: pizzaData.price,
      pizzaCreator: pizzaData.pizzaCreator,
      imageList: pizzaData.imageList,
    };

    const brandData: BrandData = { brandName };
    const brandItem: BrandObject = {
      brandInfo: brandData,
      pizzaList: [pizzaItem],
    };
    //Check if brand collection has already been created
    const alreadyInDB = await getDataOfSingleBrand(brandName);

    if (alreadyInDB) {
      try {
        //New list with new pizza item added
        const newList = [pizzaItem, ...alreadyInDB.pizzaList];
        //update brands collection
        await updateDoc(dbRef, {
          pizzaList: newList,
        });
        return { status: true };
      } catch (e) {
        throw new Error('Brand couldnt be updated with new pizza');
      }
    } else {
      //Create new collection
      await setDoc(dbRef, brandItem, { merge: false });
      return { status: true };
    }
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
      const pizzaIndex = brandItem.pizzaList.indexOf(requestedPizza);
      console.log({ pizzaIndex });
      //Return new brand object like item with requested pizza as the only pizza in the list (UN-SURE)
      const response: SinglePizza = {
        brandInfo: brandItem.brandInfo,
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
const updatePizza = async (
  brandName: string,
  pizzaName: string,
  newImage: ImageObject
) => {
  try {
    const docRef = doc(db, 'pizzas', brandName);
    //Get required brand with all pizzas
    const brand = await getDataOfSingleBrand(brandName);
    if (brand) {
      //Iterate through all pizzas in that brand, add image to matching pizza name
      const newList = brand.pizzaList.map((pizza: any) => {
        if (
          pizza.pizzaName === pizzaName &&
          !pizza.imageList.contains(newImage)
        ) {
          pizza.imageList.push(newImage);
        }
        return pizza;
      });
      //update brands collection
      await updateDoc(docRef, {
        pizzaList: newList,
      });
    }
  } catch (e) {
    console.log(e);
    throw new Error('Could not connect to database');
  }
};
const getDataOfSingleBrand = async (brand: string) => {
  if (!brand) return;
  try {
    console.log('getting data...');
    const docRef = doc(db, 'pizzas', brand);
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
const getAllPizzas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pizzas'));
    //Set type to BrandObject, but for now the doc.data() interferes by adding DocumentData propery, IDK how to avoid it atm
    let brandList: any[] = [];
    querySnapshot.forEach((doc) => {
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
  updatePizza,
  firebaseConfig,
};
