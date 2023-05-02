import React from 'react';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
export default function BackButton() {
  const router = useRouter();
  return (
    <Tooltip title='Go back'>
      <Button
        variant='contained'
        color='primary'
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/')}>
        Back
      </Button>
    </Tooltip>
  );
}
