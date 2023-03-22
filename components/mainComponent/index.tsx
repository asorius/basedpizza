import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {
  BrandObject,
  BrandsList,
  CountryObject,
  PizzaObject,
} from '../../lib/types';
import Loading from '../../lib/Loading';
// import Country from './Country';
import Brand from './Brand';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
interface Props {
  countryObjects: CountryObject[];
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function Main({ countryObjects }: Props) {
  const [isRendering, setRendering] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {countryObjects.map((countryItem: CountryObject, i: number) => {
          const brandsList: BrandsList = countryItem.brandsList;
          return (
            <Item key={i}>
              <Typography variant='h3' gutterBottom>
                {countryItem.info.name}
              </Typography>
              <Brand
                brandsObject={brandsList}
                countryName={countryItem.info.name}></Brand>
            </Item>
          );
        })}
      </Stack>
    </Box>
  );
}
