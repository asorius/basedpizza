import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { capitalized } from 'utils';

export default function AutocompleteSearchInput(props: {
  label: string;
  optionsList: string[];
  valueController: (e: any) => void;
}) {
  return (
    <Autocomplete
      id='country-select-demo'
      sx={{ width: 300 }}
      options={props.optionsList}
      autoHighlight
      blurOnSelect
      onChange={(e, value) => {
        props.valueController(value);
      }}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}>
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            label={props.label}
            inputProps={{
              ...params.inputProps,
            }}
          />
        </>
      )}
    />
  );
}
