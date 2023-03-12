import React from 'react';
import { getDataOfSinglePizza, updatePizza } from '../../firebase/app';
import { useRouter } from 'next/router';
import PizzaCard from '../../components/pizzaCardComponent';
import AuthRoute from '../../components/AuthRoute';
import { BrandObject, SinglePizza } from '../../lib/types';
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
  const [searchResult, setSearchResult] = React.useState<SinglePizza | null>(
    null
  );
  const [pizzaCredentials, setPizzaCredentials] = React.useState<string[]>([]);
  React.useEffect(() => {
    const { pizzaDetails } = router.query;
    if (!pizzaDetails) {
      return;
    }
    const brand = pizzaDetails[0];
    const name = pizzaDetails[1];
    setPizzaCredentials([name, brand]);
    const loadData = async () => {
      if (brand && name) {
        const response = await getDataOfSinglePizza(brand, name);
        if (!response) {
          router.push('/');
          return;
        }
        setSearchResult(response);
      }
    };
    loadData();
  }, [router]);

  return (
    <Layout>
      {searchResult && (
        <PizzaCard
          brandInfo={searchResult.brandInfo}
          pizzaItem={searchResult.pizzaList[0]}
        />
      )}
      {user ? (
        <UploadImage name={pizzaCredentials[0]} brand={pizzaCredentials[1]} />
      ) : (
        <h4>To upload your own image,REGISTER or SIGN IN</h4>
      )}
    </Layout>
  );
}
