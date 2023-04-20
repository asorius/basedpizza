import React from 'react';
import { updatePizza } from '../../firebase/application';

import { getAuth } from 'firebase/auth';

import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { capitalized, compressImage } from '../../utils/utils';
import Loading from '../../utils/Loading';
import { Button, FormControl, FormHelperText } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ImagePreview from '../ImagePreview';
import { uploadHandler } from '../../firebase/application';
import { ImageObject } from 'utils/types';
interface FormInputs {
  image: File | null;
}

export default function UploadImage(props: {
  name: string;
  brand: string;
  country: string;
  statusUpdate: (arg: boolean) => void;
}) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [success, setSuccess] = React.useState(false);

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
    const { name, brand, country } = props;
    console.log(props);
    try {
      if (!image) {
        console.log('No image selected');
        return;
      }
      if (country && brand && name) {
        const imageUploadResponse = await uploadHandler(image, brand, name);
        if (imageUploadResponse && user) {
          const userId = user.uid;
          //create image object with references
          const imageObject: ImageObject = {
            creator: userId,
            imageRef: imageUploadResponse.ref,
            timeStamp: imageUploadResponse.timeCreated,
          };

          await updatePizza(country, brand, name, imageObject);
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
    if (isSubmitSuccessful) {
      reset(defaults);
      setImages(null);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        props.statusUpdate(true);
      }, 1500);
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      {isSubmitting ? (
        <>
          <h3>Uploading...</h3>
          <Loading />
        </>
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
