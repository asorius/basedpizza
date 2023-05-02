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
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signIn, signInWithGoogle } from '../firebase/authentication';
import Loading from '../utils/Loading';
import BackButton from 'utils/BackButton';
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
    if (!response) {
      return;
    }
    router.back();
  };
  const handleGoogleSignIn = async () => {
    const resultUser = await signInWithGoogle();
    if (resultUser) {
      router.back();
    }
  };
  const errorHandler: SubmitErrorHandler<IFormInputs> = (error) => {
    console.log(error);
  };

  // const [isRendering, setRendering] = React.useState(true);
  // React.useEffect(() => {
  //   setTimeout(() => setRendering(!isRendering), 150);
  // }, []);
  // if (isRendering) {
  //   return <Loading />;
  // }
  return (
    <div>
      <BackButton></BackButton>
      <Container maxWidth='xs'>
        <form
          style={{ position: 'relative' }}
          onSubmit={handleSubmit(onSubmit, errorHandler)}
          encType='multipart/form-data'>
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
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              {/* form */}
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
              <h1>Sign In</h1>

              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.hasOwnProperty('email')}
                    sx={{ pb: 2 }}>
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

              {error && <h3>{error}</h3>}
              <Grid
                container
                direction='column'
                sx={{ pt: 16, pb: 6 }}
                rowSpacing={4}>
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                  columnSpacing={2}>
                  <Grid item>
                    <Button
                      type='submit'
                      variant='contained'
                      color='secondary'
                      disabled={isSubmitting}>
                      Submit
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
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs>
                  <Link href='#' variant='body2'>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href='#' variant='body2'>
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>

      {/* <button onClick={() => handleGoogleSignIn()}>with google</button> */}
    </div>
  );
}
