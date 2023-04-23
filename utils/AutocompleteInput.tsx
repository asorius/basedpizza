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
}: {
  options: string[];
  field: any;
  error: boolean;
  errorText: string;
  label: string;
}) {
  //DOESNT REGISTER COUNTRY VALUE UPON ENTER PRESS
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id='free-solo-demo'
        freeSolo
        onChange={(e) => {
          // Get index on according value from Material ui attribute
          const idx = e.currentTarget.getAttribute('data-option-index');
          if (idx) {
            //idx comes as string, convert to number
            const idxInt = parseInt(idx);
            //Macth idx to value
            const value = options[idxInt];
            //Pass the value to react-hook-form controller
            field.onChange(value);
          }
        }}
        options={options}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              {...field}
              variant='outlined'
              label={label}
              error={error}></TextField>
            <FormHelperText>{capitalized(errorText)}</FormHelperText>
          </>
        )}
      />
    </Stack>
  );
}
