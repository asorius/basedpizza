import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
} from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
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
const addData = async (pizzaData: {
  name: string;
  brand: string;
  price: number | string;
}) => {
  // const dbRef = doc(db, 'pizzas', pizzaData.brand);
  // await setDoc(dbRef, { capital: true }, { merge: true });
  const addedDoc = await addDoc(collection(db, 'pizzas'), pizzaData);

  // ------------------------- AUTHENTICATION
  // console.log(addedDoc);
  // return addedDoc;
};
const uploadHandler = async (file: File, brand: string, name: string) => {
  const storageLocation = `${brand}/${name}/${file.name}`;
  const storageRef = ref(storage, storageLocation);
  try {
    const refff = await uploadBytes(storageRef, file).then((snapshot) => {
      return {
        ref: snapshot.ref.fullPath,
        timeCreated: snapshot.metadata.timeCreated,
      };
    });
    return refff;
  } catch (error) {
    console.log(error);
  }
};
export { app, db, storage, uploadHandler, addData, firebaseConfig };
