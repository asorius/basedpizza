import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { BrandsList, CountryObject } from '../../utils/types';
import Brand from './Brand';
import { useDisplayData } from 'context/data/DataContextProvider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function Main() {
  const displayState = useDisplayData();
  if (!displayState) {
    return (
      <Card
        variant='outlined'
        style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
        <CardContent>
          <Typography variant='h6'>H A L T !</Typography>
          <Typography variant='body1'>
            There seems to be no pizzas present on the base ! Buh-bye !
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Box>
      <Stack spacing={2}>
        {displayState.countries.map((countryItem: CountryObject, i: number) => {
          const brandsList: BrandsList = countryItem.brandsList;
          return (
            <Item key={i} sx={{ backgroundColor: 'bisque' }}>
              <Typography variant='h3' gutterBottom>
                {countryItem.info.name}
              </Typography>
              <Brand
                brandObjectsArray={brandsList}
                countryName={countryItem.info.name}></Brand>
            </Item>
          );
        })}
      </Stack>
    </Box>
  );
}
