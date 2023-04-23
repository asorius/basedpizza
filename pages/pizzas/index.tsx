import React, { Suspense, lazy } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../utils/Loading';
import AuthRoute from 'components/AuthRoute';
import { userContext } from 'context/user/UserContextProvider';
const Addition = lazy(() => import('../../components/AdditionForm'));
export default function PizzaForm() {
  const { user } = userContext();

  return (
    <AuthRoute>
      <Layout>
        {/* MOVE CREATION FORM TO A NEW ROUTE / SEARCH DOES NOT FILTER TO A SINGLE PIZZA ITEM / USER ACTIONS STOPPED REROUTING */}
        {user ? (
          <Suspense fallback={<Loading />}>
            {/* <AdditionForm></AdditionForm> */}
            <Addition></Addition>
          </Suspense>
        ) : (
          <h2>
            To create or upload your photo you must register or sign in first.{' '}
          </h2>
        )}
      </Layout>
    </AuthRoute>
  );
}
