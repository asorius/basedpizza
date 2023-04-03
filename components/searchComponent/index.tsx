import React from 'react';
import { Button, FormControl, InputLabel } from '@mui/material';

import { BrandObject, CountryObject, PizzaObject } from '../../lib/types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CountrySelect from './CountrySelect';
interface Props {
  brandValue: string;
  nameValue: string;
  selectedCountries: CountryObject[];
  brandsList?: string[] | null;
  selectedBrand?: BrandObject | null;
  onChangeController: any;
}
export default function Search({
  brandValue,
  nameValue,
  selectedCountries,
  selectedBrand,
  brandsList,
  onChangeController,
}: Props) {
  const [brandNames, setBrandNames] = React.useState<string[]>([]);
  const [pizzaNames, setPizzaNames] = React.useState<string[]>([]);
  const [customCountries, setCustomCountries] = React.useState<string[] | null>(
    null
  );
  React.useEffect(() => {
    // const brandsInSelectedCountry = selectedCountries.reduce(
    //   (accumulator: Set<string>, country: CountryObject) => {
    //     const brands = Object.keys(country.brandsList);
    //     brands.forEach((key: string) => accumulator.add(key));
    //     return accumulator;
    //   },
    //   new Set()
    // );

    // const listOfBrandNames = Array.from(brandsInSelectedCountry);
    const countriesList = selectedCountries.map(
      (country: CountryObject) => country.info.name
    );
    setCustomCountries(countriesList);
    brandsList && setBrandNames(brandsList);
  }, [brandsList]);

  React.useEffect(() => {
    if (selectedBrand) {
      const pizzaNameList = Object.keys(selectedBrand.pizzaList);
      // const pizzaNameList = selectedBrand.pizzaList.map(
      //   (pizzaItem: PizzaObject) => pizzaItem.name
      // );
      setPizzaNames(pizzaNameList);
    } else {
      setPizzaNames([]);
    }
  }, [selectedBrand]);

  return (
    <>
      <CountrySelect
        label='Select country'
        customCountriesList={customCountries}
        listUpdate={setBrandNames}
        updateValue={(value: string) =>
          onChangeController({ target: { name: 'country', value } })
        }
      />
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
