import React from 'react';
import { getDataOfSinglePizza } from '../../firebase/application';
import { useRouter } from 'next/router';
import PizzaCard from '../../components/PizzaCard';
import { BrandObject, CountryObject } from '../../utils/types';
import Layout from '../../components/Layout';

import UploadImage from 'components/PizzaCard/UploadImage';
import { userContext } from 'context/user/UserContextProvider';
import Head from 'next/head';

export default function Pizza() {
  const { user } = userContext();
  const router = useRouter();
  const [resultCountryObject, setSearchResult] =
    React.useState<CountryObject | null>(null);
  const [pizzaCredentials, setPizzaCredentials] = React.useState<{
    country: string;
    brand: string;
    name: string;
  } | null>(null);
  const [status, updateStatus] = React.useState<boolean>(false);
  const [brandObject, setBrand] = React.useState<BrandObject | null>(null);
  React.useEffect(() => {
    const { pizzaDetails } = router.query;
    if (!pizzaDetails) {
      return;
    }
    // downlevelIteration typescript error, doing old-way
    const country = pizzaDetails[0];
    const brand = pizzaDetails[1];
    const name = pizzaDetails[2];
    setPizzaCredentials({ country, brand, name });
    const loadData = async () => {
      if (country && brand && name) {
        const response = await getDataOfSinglePizza(country, brand, name);
        if (!response) {
          router.push('/');
          return;
        }
        setSearchResult(response);
        setBrand(response.brandsList[brand]);
      }
    };
    loadData();
  }, [router, status]);

  return (
    <Layout>
      {pizzaCredentials && (
        <Head>
          <title>Based {pizzaCredentials.name}</title>
          <meta
            property='og:title'
            content={`${pizzaCredentials.name} of ${pizzaCredentials.name} in ${pizzaCredentials.country} `}
            key={`${pizzaCredentials.name} `}
          />
        </Head>
      )}
      {resultCountryObject && brandObject && pizzaCredentials && (
        <PizzaCard
          countryInfo={resultCountryObject.info}
          brandInfo={brandObject.info}
          pizzaItem={brandObject.pizzaList[pizzaCredentials.name]}>
          {user && pizzaCredentials ? (
            <UploadImage
              country={pizzaCredentials.country}
              brand={pizzaCredentials.brand}
              name={pizzaCredentials.name}
              statusUpdate={updateStatus}
            />
          ) : (
            <h4>To upload your own image,REGISTER or SIGN IN</h4>
          )}
        </PizzaCard>
      )}
    </Layout>
  );
}
