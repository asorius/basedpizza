import React from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalized, compressImage, formValidationSchema } from '../lib/utils';
import {
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ImagePreview from './ImagePreview';
import {
  addData,
  getAllPizzas,
  getDataOfSingleBrand,
  getDataOfSinglePizza,
  uploadHandler,
} from '../firebase/app';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';

import AutocompleteInput from '../lib/AutocompleteInput';
import { BrandObject, PizzaObject } from '../lib/types';

interface FormInputs {
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
    setError,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isLoading, isSubmitting },
  } = useForm<FormInputs>({
    resolver: yupResolver(formValidationSchema),
    defaultValues: defaults,
  });
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [image, setImages] = React.useState<File | null>(null);

  const [brandNames, setBrandNames] = React.useState<any>([]);
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [pizzaNames, setPizzaNames] = React.useState<any>([]);

  React.useEffect(() => {
    const getBrands = async () => {
      const brandslist = await getAllPizzas();
      if (!brandslist) return;
      //SOMETHING LIKE PIZZANAME(BRAND) {MAYBE?} AND THEN ON NAME SELECT IT AUTOFILS BRAND OPTION
      //NAMES SCRAPPED FROM MAJOR BRANDS? POSSIBLY API FOR THAT?
      const brands = brandslist.map(
        (brandDataObject) => brandDataObject.brandInfo.brandName
      );
      setBrandNames(brands);
    };
    getBrands();
  }, []);

  React.useEffect(() => {
    const getPizzasInBrand = async () => {
      const brandData = await getDataOfSingleBrand(selectedBrand);
      if (!brandData) return;
      const pizzaNames = brandData.pizzaList.map(
        (pizzaItem: PizzaObject) => pizzaItem.pizzaName
      );
      setPizzaNames(pizzaNames);
    };
    getPizzasInBrand();
  }, [selectedBrand]);

  const blurAction = (e: any) => {
    e.currentTarget.value && setSelectedBrand(e.currentTarget.value);
  };
  React.useEffect(() => {
    reset(defaults);
    setImages(null);
  }, [isSubmitSuccessful, reset]);
  const deleteFunc = (e: any) => {
    setImages(null);
  };
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, price, brand } = data;
    try {
      if (!image) return;
      const imageUploadResponse = await uploadHandler(image, brand, name);
      //if image has been uploaded successfully and a reference to it has been returned
      if (imageUploadResponse && user) {
        //get user id
        const userId = user.uid;

        //created image object with references
        const imageObject = {
          creator: userId,
          imageRef: imageUploadResponse.ref,
          timeStamp: imageUploadResponse.timeCreated,
        };

        const pizzaAddResponse = await addData({
          pizzaName: name,
          price: +price,
          brandName: brand,
          pizzaCreator: userId,
          imageList: [imageObject],
        });
        if (pizzaAddResponse.status) {
          router.push(`/pizzas/${brand}/${name}`);
          console.log(pizzaAddResponse);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const errorHandler: SubmitErrorHandler<FormInputs> = (error) => {
    console.log(error);
  };
  if (isSubmitting) {
    return <h2>Submitting form...</h2>;
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit, errorHandler)}
      encType='multipart/form-data'>
      <Controller
        name='brand'
        control={control}
        render={({ field }) => (
          <FormControl error={errors.hasOwnProperty('brand')}>
            {/* the input doesn't provide value to form data on submit */}
            <AutocompleteInput
              label='Brand'
              field={field}
              options={brandNames}
              onBlur={blurAction}
              error={errors.hasOwnProperty('brand')}
              errorText={errors.brand?.message || ''}
            />

            {/* <TextField
                {...field}
                variant='outlined'
                label='Brand'
                error={errors.hasOwnProperty('brand')}></TextField>
              <FormHelperText>
                {capitalized(errors.brand?.message)}
              </FormHelperText> */}
          </FormControl>
        )}
      />
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <FormControl error={errors.hasOwnProperty('name')}>
            <AutocompleteInput
              label='Pizza name'
              field={field}
              options={pizzaNames}
              error={errors.hasOwnProperty('name')}
              errorText={errors.name?.message || ''}
            />
            {/* <TextField
                  {...field}
                  variant='outlined'
                  label='Name'
                  error={errors.hasOwnProperty('name')}></TextField>
                <FormHelperText>
                  {capitalized(errors.name?.message)}
                </FormHelperText> */}
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
              type='tel'
              label='Price'
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
                    compressedFile && setImages(compressedFile);
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
