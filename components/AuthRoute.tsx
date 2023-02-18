import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';
interface Props {
  children?: React.ReactNode;
}
export default function AuthRoute({ children }: Props) {
  const auth = getAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        return user;
      } else {
        router.push('/signin');
      }
    });
  }, [auth, router]);
  return <div>{children}</div>;
}
