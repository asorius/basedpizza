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
import { registerNewUser } from '../firebase/authentication';
import Loading from '../lib/Loading';

interface IFormInputs {
  email: string;
  password: string;
  repeatPassword: string;
}
interface IUser {
  email: string | null;
  verified: boolean;
  createdAt: string | undefined;
  lastSignInTime: string | undefined;
}

const defaults = {
  email: 'asfdssd@mail.com',
  password: 'sadfasdfsd',
  repeatPassword: 'sadfasdfsd',
};
const SignUpSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6).max(30).required(),
  repeatPassword: yup.string().when('password', {
    is: (val: string) => val && val.length > 0,
    then: yup
      .string()
      .oneOf([yup.ref('password')], "Passwords don't match")
      .required('Required'),
  }),
});
export default function Register() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    resolver: yupResolver(SignUpSchema),
    defaultValues: defaults,
  });
  const [user, setUser] = React.useState<IUser | null>(null);
  const [error, setError] = React.useState<string>('');
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const response = await registerNewUser(data);
    if (!response) {
      return;
    }
    if (response.error) {
      setError(response.error);
      return;
    } else {
      // setUser(response);
      router.push('/');
    }
  };

  const errorHandler: SubmitErrorHandler<IFormInputs> = (error) => {
    console.log(error);
  };
  const [isRendering, setRendering] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setRendering(!isRendering), 500);
  }, []);
  if (isRendering) {
    return <Loading />;
  }
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
        <h1>Register</h1>

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
        <Controller
          name='repeatPassword'
          control={control}
          render={({ field }) => (
            <FormControl error={errors.hasOwnProperty('repeatPassword')}>
              <TextField
                {...field}
                variant='outlined'
                disabled={isSubmitting}
                label='Repeat password'
                error={errors.hasOwnProperty('repeatPassword')}></TextField>
              <FormHelperText>
                {capitalized(errors.repeatPassword?.message)}
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
