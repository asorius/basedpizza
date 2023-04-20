import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getAuth } from 'firebase/auth';

import PizzaCard from '../pizzaCard';
import { PizzasList, BrandsList } from '../../utils/types';
import Loading from '../../utils/Loading';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
interface Props {
  brandObjectsArray: BrandsList;
  countryName: string;
}
export default function Main({ brandObjectsArray, countryName }: Props) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [isRendering, setRendering] = React.useState(true);
  const brandsArray = React.useMemo(
    () => Object.entries(brandObjectsArray),
    [brandObjectsArray]
  );

  React.useEffect(() => {
    setTimeout(() => setRendering(!isRendering), 100);
  }, []);
  if (isRendering) {
    return <Loading />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {brandsArray.map(([name, brandItem]) => {
          const pizzaList: PizzasList = brandItem.pizzaList;
          return (
            <Item key={name}>
              <Typography variant='h3' gutterBottom>
                {brandItem.info.name}
              </Typography>
              {Object.entries(pizzaList).map(([name, pizzaItem]) => {
                const pizzaName = pizzaItem.name;
                return (
                  <PizzaCard
                    key={name}
                    brandInfo={brandItem.info}
                    pizzaItem={pizzaItem}
                    user={user}
                    link={`/pizzas/${countryName}/${brandItem.info.name}/${pizzaName}`}
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
