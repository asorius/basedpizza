import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import SummarizeIcon from '@mui/icons-material/Summarize';
import {
  CardHeader,
  Avatar,
  CardActions,
  Button,
  Link,
  Stack,
  Box,
} from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { userContext } from 'context/user/UserContextProvider';

export default function UserCard() {
  const [userStatus, setStatus] = React.useState(false);
  const { user } = userContext();
  React.useEffect(() => {
    if (user) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [user]);
  const auth = getAuth();
  if (!user || !userStatus) {
    return (
      <>
        <Link href={'/signin'}>
          <Button variant='outlined'>Sign In</Button>
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
              setStatus(false);
              signOut(auth);
            }}>
            Log Out
          </Button>
        </Stack>
      </CardActions>
    </Box>
  );
}
