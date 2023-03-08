import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PizzaCard from './PizzaCard';
import { BrandObject, ImageObject, PizzaObject } from '../lib/types';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
interface Props {
  brandObjects: BrandObject[];
}
export default function BasicStack({ brandObjects }: Props) {
  console.log(brandObjects);
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {brandObjects.map((brandItem: BrandObject, i: number) => {
          const pizzaList: PizzaObject[] = brandItem.pizzaList;
          return (
            <Item key={i}>
              <Typography variant='h3' gutterBottom>
                {brandItem.brandInfo.brandName}
              </Typography>
              {pizzaList.map((pizzaItem: PizzaObject, index: number) => {
                const pizzaName = pizzaItem.pizzaName;
                const images: ImageObject[] = pizzaItem.imageList;
                return (
                  <PizzaCard
                    key={index}
                    brandInfo={brandItem.brandInfo}
                    pizzaItem={pizzaItem}
                    link={`/pizzas/${brandItem.brandInfo.brandName}/${pizzaName}`}
                  />
                );
              })}
            </Item>
          );
        })}
      </Stack>
    </Box>
  );
}
