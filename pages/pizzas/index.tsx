import React, { Suspense, lazy } from 'react';
// import { AdditionForm } from '../../components/AdditionForm';
import Layout from '../../components/Layout';
import { getAuth } from 'firebase/auth';
// import { app } from '../../firebase/application';
import { app, getAllPizzas } from '../../firebase/application';
import { BrandObject, PizzaObject } from 'lib/types';
import Loading from '../../lib/Loading';
import AuthRoute from 'components/AuthRoute';
const Addition = lazy(() => import('../../components/AdditionForm'));
export default function PizzaForm() {
  const auth = getAuth(app);
  const user = auth.currentUser;

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
