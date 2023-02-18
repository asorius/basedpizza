import React from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalized, formValidationSchema } from '../lib/utils';
import {
  Button,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ImagePreview from './ImagePreview';
import { addData, uploadHandler } from '../firebase/app';
import { getAuth, signOut } from 'firebase/auth';

interface IFormInputs {
  name: string;
  brand: string;
  price: number | string;
  image: File | null;
}

const defaults = {
  name: '',
  brand: '',
  price: '',
  image: null,
};

export function AdditionForm() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isLoading, isSubmitting },
  } = useForm<IFormInputs>({
    resolver: yupResolver(formValidationSchema),
    defaultValues: defaults,
  });
  const [image, setImages] = React.useState<File | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  React.useEffect(() => {
    reset(defaults);
    setImages(null);
  }, [isSubmitSuccessful, reset]);
  const deleteFunc = (e: any) => {
    setImages(null);
  };
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const { name, price, brand } = data;
    try {
      if (!image) return;
      const res = await uploadHandler(image, brand, name);
      //if res, that means there image has been uploaded successfully and a reference to it has been returned
      if (res && user) {
        //TODO ADD DATA AND REDIRECT TO DYNAMICALLY CREATED PAGE

        //get user id
        const userId = user.uid;

        //created image object with references
        const imageObject = {
          creator: userId,
          imageRef: res.ref,
          timeStamp: res.timeCreated,
        };

        const addedData = await addData({
          name,
          price,
          brand,
          creator: userId,
          images: [imageObject],
        });
        console.log(addedData);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const errorHandler: SubmitErrorHandler<IFormInputs> = (error) => {
    console.log(error);
  };
  if (isSubmitting) {
    return <h2>Submitting form...</h2>;
  }
  return (
    <>
      {user && (
        <div>
          <h2>{user.email}</h2>
          <Button onClick={() => signOut(auth)}>Log out</Button>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit, errorHandler)}
        encType='multipart/form-data'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FormControl error={errors.hasOwnProperty('name')}>
              <TextField
                {...field}
                variant='outlined'
                label='Name'
                error={errors.hasOwnProperty('name')}></TextField>
              <FormHelperText>
                {capitalized(errors.name?.message)}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name='brand'
          control={control}
          render={({ field }) => (
            <FormControl error={errors.hasOwnProperty('brand')}>
              <TextField
                {...field}
                variant='outlined'
                label='Brand'
                error={errors.hasOwnProperty('brand')}></TextField>
              <FormHelperText>
                {capitalized(errors.brand?.message)}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name='price'
          control={control}
          render={({ field }) => (
            <FormControl error={errors.hasOwnProperty('price')}>
              <InputLabel htmlFor='price'>Price</InputLabel>
              <OutlinedInput
                {...field}
                type='number'
                endAdornment={<InputAdornment position='end'>$</InputAdornment>}
              />
              <FormHelperText>
                {capitalized(errors.price?.message)}
              </FormHelperText>
            </FormControl>
          )}
        />
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
                      field.onChange(e);
                      setImages(file);
                    }
                  }}
                />
              )}
            />
          </Button>
          <FormHelperText>{capitalized(errors.image?.message)}</FormHelperText>
        </FormControl>
        <Button type='submit'>Submit</Button>
        <ImagePreview image={image} deleteFunc={deleteFunc}></ImagePreview>
      </form>
    </>
  );
}
