import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useRouter } from 'next/router';
export default function Navbar() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  return (
    <div>
      {user ? (
        <div>
          <h2>{user.email}</h2>
          <Button
            onClick={() => {
              router.push('/');
              signOut(auth);
            }}>
            Log out
          </Button>
        </div>
      ) : (
        <>
          <Link href={'/signin'}>
            <Button variant='outlined'>Sign In</Button>
          </Link>
          <Link href={'/register'}>
            <Button variant='contained'>Register</Button>
          </Link>{' '}
        </>
      )}
    </div>
  );
}
