import React from 'react';
import { getDataOfSinglePizza, updatePizza } from '../../firebase/app';
import { useRouter } from 'next/router';
import PizzaCard from '../../components/pizzaCardComponent';
import AuthRoute from '../../components/AuthRoute';
import { BrandObject, CountryObject, SinglePizza } from '../../lib/types';
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
import { uploadHandler } from '../../firebase/app';
import UploadImage from 'components/pizzaCardComponent/UploadImage';

export default function Pizza() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [searchResult, setSearchResult] = React.useState<CountryObject | null>(
    null
  );
  const [pizzaCredentials, setPizzaCredentials] = React.useState<string[]>([]);
  const [status, updateStatus] = React.useState<boolean>(false);
  React.useEffect(() => {
    const { pizzaDetails } = router.query;
    if (!pizzaDetails) {
      return;
    }
    const country = pizzaDetails[0];
    const brand = pizzaDetails[1];
    const name = pizzaDetails[2];
    setPizzaCredentials([name, brand]);
    const loadData = async () => {
      if (country && brand && name) {
        const response = await getDataOfSinglePizza(country, brand, name);
        if (!response) {
          router.push('/');
          return;
        }
        setSearchResult(response);
      }
    };
    loadData();
  }, [router, status]);

  return (
    <Layout>
      {searchResult && (
        <PizzaCard
          countryInfo={searchResult.info}
          brandInfo={searchResult.brandsList[0].info}
          pizzaItem={searchResult.brandsList[0].pizzaList[0]}
        />
      )}
      {user ? (
        <UploadImage
          name={pizzaCredentials[1]}
          brand={pizzaCredentials[2]}
          statusUpdate={updateStatus}
        />
      ) : (
        <h4>To upload your own image,REGISTER or SIGN IN</h4>
      )}
    </Layout>
  );
}
