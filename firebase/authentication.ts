import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { app } from './application';
const provider = new GoogleAuthProvider();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
interface IUserInput {
  email: string;
  password: string;
}
interface IUser {
  email: string | null;
  verified: boolean;
  createdAt: string | undefined;
  lastSignInTime: string | undefined;
}
interface IError {
  error: string;
}
const registerNewUser = async ({
  email,
  password,
}: IUserInput): Promise<any> => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (response.user) {
      const user = response.user;
      const userData = {
        email: user.email,
        verified: user.emailVerified,
        createdAt: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      };
      return userData;
    } else {
      throw new Error();
    }
  } catch (error: any) {
    // for (const key in error) {
    //   console.log(key);
    // }
    // console.log(error.customData._tokenResponse.error.message);
    return { error: error.customData._tokenResponse.error.message };
  }
};
const signIn = async ({ email, password }: IUserInput) => {
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
    return error;
  }
};
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    if (user) {
      console.log(user);
      return user;
    }
  } catch (error: any) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    console.log(errorCode);
    console.log(errorMessage);
    console.log(email);
  }
};
export { registerNewUser, signIn, auth, signInWithGoogle };
