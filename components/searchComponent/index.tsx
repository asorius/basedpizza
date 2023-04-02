import React from 'react';
import { Button, FormControl, InputLabel } from '@mui/material';

import { BrandObject, PizzaObject } from '../../lib/types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CountrySelect from './CountrySelect';
interface Props {
  brandValue: string;
  nameValue: string;
  countryValue: string;
  brandList: BrandObject[];
  selectedBrand: BrandObject | null;
  onChangeController: any;
}
export default function Search({
  brandValue,
  nameValue,
  countryValue,
  brandList,
  selectedBrand,
  onChangeController,
}: Props) {
  const [brandNames, setBrandNames] = React.useState<string[]>([]);
  const [pizzaNames, setPizzaNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    const listOfBrandNames = brandList.map(
      (brandDataObject) => brandDataObject.info.name
    );
    setBrandNames(listOfBrandNames);
  }, []);

  React.useEffect(() => {
    if (selectedBrand) {
      const pizzaNameList = selectedBrand.pizzaList.map(
        (pizzaItem: PizzaObject) => pizzaItem.name
      );
      setPizzaNames(pizzaNameList);
    } else {
      setPizzaNames([]);
    }
  }, [brandValue, selectedBrand]);

  return (
    <>
      <CountrySelect label='mananan' />
      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel id='select-brand'>Brand</InputLabel>
        <Select
          labelId='select-brand'
          id='select-small-brand'
          label='Brand'
          name='brand'
          onChange={(e) => onChangeController(e)}
          value={brandValue}>
          <MenuItem value=''>
            <em>All</em>
          </MenuItem>
          {brandNames.map((brand: string) => (
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
          disabled={pizzaNames.length > 1 ? false : true}
          value={nameValue}
          onChange={(e) => onChangeController(e)}>
          <MenuItem value=''>
            <em>All</em>
          </MenuItem>
          {pizzaNames.map((name: string) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
