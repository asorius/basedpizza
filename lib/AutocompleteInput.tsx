import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import { capitalized } from './utils';
export default function AutocompleteInput({
  options,
  field,
  error,
  errorText,
  label,
  onBlur,
}: {
  options: string[];
  field: any;
  error: boolean;
  errorText: string;
  label: string;
  onBlur?: (t: any) => void;
}) {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id='free-solo-demo'
        freeSolo
        options={options}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              {...field}
              variant='outlined'
              label={label}
              onBlur={(e) => {
                onBlur && onBlur(e);
              }}
              error={error}></TextField>
            <FormHelperText>{capitalized(errorText)}</FormHelperText>
          </>
        )}
      />
    </Stack>
  );
}
