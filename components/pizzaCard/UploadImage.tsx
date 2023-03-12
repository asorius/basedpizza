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

export default function UploadImage(props: any) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [success, setSuccess] = React.useState(false);

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
    const { name, brand } = props;
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
    }, 1500);
  }, [isSubmitSuccessful, reset]);
  if (isSubmitting) {
    return <h3>Uploading...</h3>;
  }
  if (success) {
    return <h3>Success!</h3>;
  }
  return (
    <>
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
    </>
  );
}
