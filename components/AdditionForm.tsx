import React from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  ErrorOption,
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

interface IFormInputs {
  name: string;
  brand: string;
  price: number | string;
  image: File | null;
}
const defaults = {
  name: 'asfdssd',
  brand: 'sadfasdfsd',
  price: 20,
  image: null,
};

export function AdditionForm() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<IFormInputs>({
    resolver: yupResolver(formValidationSchema),
    defaultValues: defaults,
  });
  const [image, setImages] = React.useState<File | null>(null);

  const deleteFunc = (e: any) => {
    setImages(null);
  };
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const { name, price, brand } = data;
    try {
      if (!image) return;
      // await addData({ name, price, brand });
      const res = await uploadHandler(image, brand, name);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const errorHandler: SubmitErrorHandler<IFormInputs> = (error) => {
    console.log(error);
  };
  return (
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
            <FormHelperText>{capitalized(errors.name?.message)}</FormHelperText>
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
  );
}
