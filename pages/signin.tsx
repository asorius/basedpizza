import React from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalized } from '../lib/utils';
import { Button, FormControl, TextField, FormHelperText } from '@mui/material';
import { signIn } from '../firebase/auth';

interface IFormInputs {
  email: string;
  password: string;
}

const defaults = {
  email: 'asfdssd@mail.com',
  password: 'sadfasdfsd',
};
const SignUpSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6).max(30).required(),
});
export default function Login() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    resolver: yupResolver(SignUpSchema),
    defaultValues: defaults,
  });
  const [error, setError] = React.useState<string>('');
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const response = await signIn(data);
    console.log(response);
    if (!response) {
      return;
    }
    // if (response.error) {
    //   setError(response.error);
    //   return;
    // } else {
    router.push('/');
    // }
  };

  const errorHandler: SubmitErrorHandler<IFormInputs> = (error) => {
    console.log(error);
  };
  return (
    <div>
      <form
        style={{ position: 'relative' }}
        onSubmit={handleSubmit(onSubmit, errorHandler)}
        encType='multipart/form-data'>
        {isSubmitting && (
          <div
            style={{
              position: 'absolute',
              inset: '2rem',
              textAlign: 'center',
              opacity: 0.5,
              color: 'red',
            }}>
            Submitting
          </div>
        )}
        <h1>Login</h1>

        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <FormControl error={errors.hasOwnProperty('email')}>
              <TextField
                {...field}
                variant='outlined'
                disabled={isSubmitting}
                label='Email'
                error={errors.hasOwnProperty('email')}></TextField>
              <FormHelperText>
                {capitalized(errors.email?.message)}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <FormControl error={errors.hasOwnProperty('password')}>
              <TextField
                {...field}
                variant='outlined'
                disabled={isSubmitting}
                label='Password'
                error={errors.hasOwnProperty('password')}></TextField>
              <FormHelperText>
                {capitalized(errors.password?.message)}
              </FormHelperText>
            </FormControl>
          )}
        />

        <Button type='submit' disabled={isSubmitting}>
          Submit
        </Button>

        {error && <h3>{error}</h3>}
      </form>
    </div>
  );
}
