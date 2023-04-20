import React from 'react';
import { Button, FormControl, InputLabel } from '@mui/material';

import { CountryObject } from '../../utils/types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CountrySelect from './CountrySelect';
import { useDisplayData, useData } from 'context/data/DataContextProvider';
export default function Search() {
  const [brandOptions, setBrandOptions] = React.useState<string[]>([]);
  const [pizzaOptions, setPizzaOptions] = React.useState<string[]>([]);
  const [customCountries, setCustomCountries] = React.useState<string[] | null>(
    null
  );
  const [searchInput, setSearchInput] = React.useState<{ [x: string]: string }>(
    {
      country: '',
      brand: '',
      name: '',
    }
  );
  const displayState = useDisplayData();
  const dispatch = displayState?.dispatch;
  const countriesOriginal = useData();
  const inputController = React.useCallback((e: any) => {
    if (e.target) {
      const key: string = e.target.name;
      const val: string = e.target.value;
      setSearchInput((old) => ({ ...old, [key]: val }));
    }
  }, []);
  React.useEffect(() => {
    const countryInputValue = searchInput.country;
    const brandInputValue = searchInput.brand;
    const nameInputValue = searchInput.name;
    if (!countriesOriginal) {
      return;
    }
    dispatch &&
      dispatch({
        type: 'UPDATE',
        payload: {
          originalList: countriesOriginal,
          countryInputValue,
          brandInputValue,
          nameInputValue,
        },
      });
  }, [searchInput]);
  React.useEffect(() => {
    if (!displayState) return;
    const { brands, pizzas } = displayState;
    const brandNames = brands && brands.map((brand) => Object.keys(brand)[0]);
    const pizzaNames = pizzas && pizzas.map((pizza) => Object.keys(pizza)[0]);
    const noDuplicatesBrands = Array.from(new Set(brandNames));
    const noDuplicatesPizzas = Array.from(new Set(pizzaNames));
    const countriesList = displayState.countries.map(
      (country: CountryObject) => country.info.name
    );
    setBrandOptions(noDuplicatesBrands);
    setPizzaOptions(noDuplicatesPizzas);
    setCustomCountries(countriesList);
  }, [displayState]);

  return (
    <>
      <CountrySelect
        label='Select country'
        customCountriesList={customCountries}
        listUpdate={setBrandOptions}
        updateValue={(value: string) =>
          inputController({ target: { name: 'country', value } })
        }
      />
      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel id='select-brand'>Brand</InputLabel>
        <Select
          labelId='select-brand'
          id='select-small-brand'
          label='Brand'
          name='brand'
          onChange={inputController}
          value={searchInput.brand}>
          <MenuItem value=''>
            <em>All</em>
          </MenuItem>
          {brandOptions.map((brand: string) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel id='select-name'>Name</InputLabel>
        <Select
          labelId='select-name'
          id='select-small-name'
          label='Name'
          name='name'
          disabled={pizzaOptions.length > 1 ? false : true}
          value={searchInput.name}
          onChange={inputController}>
          <MenuItem value=''>
            <em>All</em>
          </MenuItem>
          {pizzaOptions.map((name: string) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
