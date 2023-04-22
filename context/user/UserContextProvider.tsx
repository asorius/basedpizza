import React, { useEffect, useMemo, useState } from 'react';
import { createContext, useReducer, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from './types';
import { auth } from '../../firebase/authentication';

interface State {
  user: User | null;
  userHistory?: any;
}

const initialState: State = { user: null };

const userCtx = createContext<State>(initialState);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userState, setUser] = useState(initialState);
  // const auth = getAuth();
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('User state has changed');
      if (user) {
        setUser((prev) => ({
          ...prev,
          user: {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          },
        }));
      } else {
        setUser(initialState);
      }
    });
  }, [auth]);
  return <userCtx.Provider value={userState}>{children}</userCtx.Provider>;
}
export function userContext() {
  return useContext(userCtx);
}
