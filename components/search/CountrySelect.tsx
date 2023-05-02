import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import { capitalized } from 'utils';
import { getDataOfSingleCountry } from '../../firebase/application';
import { CountryJSONType } from 'utils/types';
import { countries } from 'utils';

export default function CountrySelect(props: {
  label: string;
  field?: any;
  error?: boolean;
  errorText?: string;
  listUpdate?: (list: string[]) => void;
  updateValue?: (K: string) => void;
  customCountriesList?: string[] | null;
}) {
  return (
    <Autocomplete
      id='country-select'
      sx={{ width: 300 }}
      options={
        props.customCountriesList
          ? countries.filter(
              (country: CountryJSONType) =>
                props.customCountriesList &&
                props.customCountriesList.includes(country.label)
            )
          : countries
      }
      autoHighlight
      blurOnSelect
      onChange={async (e, countryOption) => {
        if (countryOption) {
          const value = countryOption.label;
          if (props.updateValue) {
            props.updateValue(value);
            return;
          }
          //If a function to update brands list is provided
          if (props.listUpdate) {
            //Find the required country
            const selectedCountry = await getDataOfSingleCountry(value);

            if (selectedCountry) {
              //If there are brands already in selected country object create array of brand names
              const list =
                selectedCountry && Object.keys(selectedCountry.brandsList);
              list && props.listUpdate(list);
            } else {
              //If no country was found, reset the list
              props.listUpdate([]);
            }
          }
          if (props.field) {
            //Pass the value to react-hook-form controller
            props.field.onChange(value);
          }
        } else {
          props.updateValue && props.updateValue('');
        }
      }}
      getOptionLabel={(option: CountryJSONType) => option.label}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}>
          <img
            width='20'
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=''
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            {...props.field}
            label={props.label}
            error={props.error}
            inputProps={{
              ...params.inputProps,
            }}
          />
          <FormHelperText>{capitalized(props.errorText)}</FormHelperText>
        </>
      )}
    />
  );
}
