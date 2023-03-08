import React from 'react';
import { getDataOfSinglePizza } from '../../firebase/app';
import { useRouter } from 'next/router';
import PizzaCard from '../../components/PizzaCard';
import AuthRoute from '../../components/AuthRoute';
import { BrandObject } from '../../lib/types';
export default function Pizza() {
  const router = useRouter();
  const [searchResult, setSearchResult] = React.useState<BrandObject | null>(
    null
  );
  React.useEffect(() => {
    const { pizzaDetails } = router.query;
    const brand = pizzaDetails && pizzaDetails[0];
    const name = pizzaDetails && pizzaDetails[1];
    const loadData = async () => {
      if (brand && name) {
        const response = await getDataOfSinglePizza(brand, name);
        if (!response) router.push('/');
        response && setSearchResult(response);
      }
    };
    loadData();
  }, [router]);
  return (
    <AuthRoute>
      {searchResult && (
        <PizzaCard
          brandInfo={searchResult.brandInfo}
          pizzaItem={searchResult.pizzaList[0]}
        />
      )}
    </AuthRoute>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
// This function is to generate the path values
// Get all data from firestore to generate paths with template of something like this /{brand}/{pizza}

// const firebaseResponse = await getAllPizzas();

//DOES NOT GET AUTHORIZED FOR SOME REASON^^
// const paths =
//   firebaseResponse &&
//   firebaseResponse.map((pizzaObject: IPizzaProps) => {
//     return {
//       params: {
//         pizzaDetails: [pizzaObject.brand, pizzaObject.name],
//       },
//     };
//   });
// console.log('paths ====>>>' + firebaseResponse);
//   const paths = null;
//   return {
//     paths: [{ params: { pizzaDetails: ['brand2', 'pizaname'] } }] || [],
//     fallback: false,
//   };
// };
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   // This function is to generate/fetch and pass data through props according to incoming params

//   if (!params || !params.pizzaDetails) return { props: { message: 'lol' } };
//   const brand = params.pizzaDetails[0];
//   const name = params.pizzaDetails[1];

//   // console.log('params ====>>>' + params);
//   console.log('params ====>>>' + brand + name);
//   // await getDataOfSinglePizza(brand, name);
//   return { props: { message: 'succsess' }, revalidate: 5 };
// };
