import React from 'react';
import { getDataOfSinglePizza, updatePizza } from '../../firebase/application';
import { useRouter } from 'next/router';
import PizzaCard from '../../components/pizzaCardComponent';
import AuthRoute from '../../components/AuthRoute';
import {
  BrandObject,
  BrandsList,
  CountryObject,
  SinglePizza,
} from '../../lib/types';
import Layout from '../../components/Layout';
import { getAuth } from 'firebase/auth';

import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalized, compressImage } from '../../lib/utils';
import {
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ImagePreview from '../../components/ImagePreview';
import { uploadHandler } from '../../firebase/application';
import UploadImage from 'components/pizzaCardComponent/UploadImage';

export default function Pizza() {
  const auth = getAuth();
  const user = auth.currentUser;
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
    console.log(pizzaDetails);
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
