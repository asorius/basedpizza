import React, { Suspense, lazy } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../utils/Loading';
import { userContext } from 'context/user/UserContextProvider';
const Addition = lazy(() => import('../../components/AdditionForm'));
export default function PizzaForm() {
  const { user } = userContext();

  return (
    <Layout>
      {user ? (
        <Suspense fallback={<Loading />}>
          <Addition></Addition>
        </Suspense>
      ) : (
        <h2>
          To create or upload your photo you must register or sign in first.{' '}
        </h2>
      )}
    </Layout>
  );
}
