import React from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  capitalized,
  compressImage,
  formValidationSchema,
} from '../utils/utils';
import {
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  TextField,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ImagePreview from './ImagePreview';
import { addData, uploadHandler } from '../firebase/application';
import { useRouter } from 'next/router';

import AutocompleteInput from '../utils/AutocompleteInput';
import CountrySelect from './search/CountrySelect';
import { userContext } from 'context/user/UserContextProvider';

interface FormInputs {
  country: string;
  name: string;
  brand: string;
  price: number | string;
  image: File | null;
}

const defaults = {
  country: '',
  name: '',
  brand: '',
  price: '',
  image: null,
};

export default function AdditionForm() {
  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormInputs>({
    resolver: yupResolver(formValidationSchema),
    defaultValues: defaults,
  });
  const router = useRouter();
  const { user } = userContext();

  const [image, setImage] = React.useState<File | null>(null);
  const [brandNames, setBrandNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaults);
      setImage(null);
    }
  }, [isSubmitSuccessful, reset]);
  const deleteFunc = (e: any) => {
    setImage(null);
  };
  const cropHandler = (croppedImageFile: File) => {
    // console.log(croppedImage.imageURL);
    setImage(croppedImageFile);
  };
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, price, brand, country } = data;

    try {
      if (!image) return;
      //NOT SURE IF COUNTRY SHOULD AFFECT THE IMAGE STORAGE  ***FOR LATER
      const imageUploadResponse = await uploadHandler(image, brand, name);
      //if image has been uploaded successfully and a reference to it has been returned
      if (imageUploadResponse && user) {
        //get user id
        const userId = user.uid;
        if (!userId) {
          console.log('NO USER');
          return;
        }
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
          countryName: country,
          pizzaCreator: userId,
          imageList: [imageObject],
        });
        if (pizzaAddResponse.status) {
          router.push(`/pizzas/${country}/${brand}/${name}`);
        } else {
          // setResponseStatus(false);
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
        name='country'
        control={control}
        render={({ field }) => (
          <FormControl error={errors.hasOwnProperty('country')}>
            <CountrySelect
              label='Country'
              field={field}
              listUpdate={setBrandNames}
              error={errors.hasOwnProperty('country')}
              errorText={errors.country?.message || ''}></CountrySelect>
          </FormControl>
        )}
      />
      <Controller
        name='brand'
        control={control}
        render={({ field }) => (
          <FormControl error={errors.hasOwnProperty('brand')}>
            <AutocompleteInput
              label='Brand'
              field={field}
              options={brandNames}
              error={errors.hasOwnProperty('brand')}
              errorText={errors.brand?.message || ''}
            />
          </FormControl>
        )}
      />
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <FormControl error={errors.hasOwnProperty('name')}>
            <TextField
              {...field}
              variant='outlined'
              label='Pizza name'
              error={errors.hasOwnProperty('name')}></TextField>
            <FormHelperText>{capitalized(errors.name?.message)}</FormHelperText>
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
                    compressedFile && setImage(compressedFile);
                  }
                }}
              />
            )}
          />
        </Button>
        <FormHelperText>{capitalized(errors.image?.message)}</FormHelperText>
      </FormControl>
      <Button type='submit'>Submit</Button>
      <ImagePreview
        image={image}
        updateFunc={cropHandler}
        deleteFunc={deleteFunc}></ImagePreview>
    </form>
  );
}
