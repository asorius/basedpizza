import React from 'react';
import { getDataOfSinglePizza, updatePizza } from '../../firebase/app';
import { useRouter } from 'next/router';
import PizzaCard from '../../components/pizzaCard';
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

export default function Pizza() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [searchResult, setSearchResult] = React.useState<SinglePizza | null>(
    null
  );
  const [success, setSuccess] = React.useState(false);
  React.useEffect(() => {
    const { pizzaDetails } = router.query;
    const brand = pizzaDetails && pizzaDetails[0];
    const name = pizzaDetails && pizzaDetails[1];
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
  interface FormInputs {
    image: File | null;
  }

  const defaults = {
    image: null,
  };
  const [image, setImages] = React.useState<File | null>(null);
  const deleteFunc = (e: any) => {
    setImages(null);
  };
  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isLoading, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: defaults,
  });
  const onSubmit: SubmitHandler<FormInputs> = async () => {
    const { pizzaDetails } = router.query;

    const brand = pizzaDetails && pizzaDetails[0];
    const name = pizzaDetails && pizzaDetails[1];
    try {
      if (!image) return;
      if (brand && name) {
        const imageUploadResponse = await uploadHandler(image, brand, name);
        if (imageUploadResponse && user) {
          const userId = user.uid;
          //create image object with references
          const imageObject = {
            creator: userId,
            imageRef: imageUploadResponse.ref,
            timeStamp: imageUploadResponse.timeCreated,
          };

          await updatePizza(brand, name, imageObject);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const errorHandler: SubmitErrorHandler<FormInputs> = (error) => {
    console.log(error);
  };
  React.useEffect(() => {
    reset(defaults);
    setImages(null);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 500);
  }, [isSubmitSuccessful, reset]);
  return (
    <Layout>
      <AuthRoute>
        {searchResult && (
          <PizzaCard
            brandInfo={searchResult.brandInfo}
            pizzaItem={searchResult.pizzaList[0]}
          />
        )}
        {user ? <>Upload</> : <>To upload your own image,REGISTER or SIGN IN</>}
        {isSubmitting ? (
          <h3>Uploading...</h3>
        ) : success ? (
          <h3>Success!</h3>
        ) : (
          <form
            encType='multipart/form-data'
            onSubmit={handleSubmit(onSubmit, errorHandler)}>
            <FormControl error={errors.hasOwnProperty('image')}>
              <Button
                component='label'
                variant='contained'
                startIcon={<PhotoCamera />}>
                Upload
                <Controller
                  control={control}
                  name='image'
                  render={({ field }) => (
                    <input
                      hidden
                      accept='image/*'
                      type='file'
                      onChange={async (e) => {
                        if (e.currentTarget.files) {
                          const file = e.currentTarget.files[0];
                          if (!file.type.startsWith('image')) {
                            setError('image', {
                              message: 'Please select an image file',
                            });
                            return;
                          }
                          const compressedFile = await compressImage(file, {
                            quality: 0.5,
                          });
                          field.onChange(e);
                          if (compressedFile) {
                            setImages(compressedFile);
                          }
                        }
                      }}
                    />
                  )}
                />
              </Button>
              <FormHelperText>
                {capitalized(errors.image?.message)}
              </FormHelperText>
            </FormControl>
            {image && <Button type='submit'>Submit file</Button>}
          </form>
        )}
        <ImagePreview image={image} deleteFunc={deleteFunc} />
      </AuthRoute>
    </Layout>
  );
}
