import React from 'react';
import { User } from 'context/user/types';
import LogoutIcon from '@mui/icons-material/Logout';
import SummarizeIcon from '@mui/icons-material/Summarize';
import {
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button,
  Link,
  Stack,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import { getAuth, signOut } from 'firebase/auth';
import { userContext } from 'context/user/UserContextProvider';

export default function UserCard() {
  const { user } = userContext();
  const auth = getAuth();
  const router = useRouter();
  if (!user) {
    return (
      <>
        <Link href={'/signin'}>
          <Button variant='contained'>Sign In</Button>
        </Link>
        <Link href={'/register'}>
          <Button variant='contained'>Register</Button>
        </Link>{' '}
      </>
    );
  }
  return (
    <Box sx={{ maxWidth: 545 }}>
      <CardHeader
        avatar={<Avatar aria-label='user' src={user.photoURL || ''} />}
        title={user.displayName}
        subheader={user.email}
      />

      <CardActions disableSpacing>
        <Stack direction='row' spacing={2}>
          <Button
            size='small'
            variant='contained'
            startIcon={<SummarizeIcon />}>
            Your base
          </Button>
          <Button
            size='small'
            variant='outlined'
            endIcon={<LogoutIcon />}
            onClick={() => {
              router.push('/');
              signOut(auth);
            }}>
            Log Out
          </Button>
        </Stack>
      </CardActions>
    </Box>
  );
}
