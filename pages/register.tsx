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
import { capitalized } from '../utils';
import {
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Avatar,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { registerNewUser } from '../firebase/authentication';
import Loading from '../utils/Loading';
import { signInWithGoogle } from '../firebase/authentication';
import BackButton from 'utils/BackButton';
import CopyrightIcon from '@mui/icons-material/Copyright';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface FormInputs {
  email: string;
  password: string;
  repeatPassword: string;
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
function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}>
      {'Copyright © '}
      <Link color='inherit' href='/'>
        PizzaBase
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
export default function Register() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: yupResolver(SignUpSchema),
    defaultValues: defaults,
  });
  const [error, setError] = React.useState<string>('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const resultUser = await signInWithGoogle();
    if (resultUser) {
      router.back();
    }
  };
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const response = await registerNewUser(data);
    if (!response) {
      return;
    }
    if (response.error) {
      setError(response.error);
      return;
    } else {
      router.push('/');
    }
  };

  const errorHandler: SubmitErrorHandler<FormInputs> = (error) => {
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
      <Container component='main' maxWidth='xs'>
        <BackButton></BackButton>

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
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
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={errors.hasOwnProperty('email')}>
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
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={errors.hasOwnProperty('password')}>
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
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='repeatPassword'
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={errors.hasOwnProperty('repeatPassword')}>
                        <TextField
                          {...field}
                          variant='outlined'
                          disabled={isSubmitting}
                          label='Repeat password'
                          error={errors.hasOwnProperty(
                            'repeatPassword'
                          )}></TextField>
                        <FormHelperText>
                          {capitalized(errors.repeatPassword?.message)}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                direction='column'
                sx={{ pt: 6, pb: 6 }}
                rowSpacing={4}>
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                  columnSpacing={2}>
                  <Grid item>
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      disabled={isSubmitting}>
                      Register
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant='outlined'
                      color='primary'
                      disabled={isSubmitting}
                      onClick={() => handleGoogleSignIn()}>
                      with Google
                    </Button>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 4, pb: 6 }}>
                    <FormControlLabel
                      sx={{ pl: 8 }}
                      control={
                        <Checkbox value='allowExtraEmails' color='primary' />
                      }
                      label='I want to receive inspiration, marketing promotions and updates via email.'
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid container justifyContent='flex-end'>
                <Grid item>
                  <Link href='#' variant='body2'>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {error && <h3>{error}</h3>}
          </form>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* <form
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
         */}

      {/* <Controller
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
        /> */}

      {/* <Button type='submit' disabled={isSubmitting}>
          Submit
        </Button> */}

      {/* {error && <h3>{error}</h3>}
      </form> */}
      {/* 
      <button onClick={() => handleGoogleSignIn()}>with google</button> */}
    </div>
  );
}
