import firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from './app';

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
interface IUser {
  email: string;
  password: string;
}
const registerNewUser = async ({ email, password }: IUser) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential) {
      const user = userCredential.user;
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};
const signIn = async ({ email, password }: IUser) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential) {
      const user = userCredential.user;
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};
export { registerNewUser, signIn };
