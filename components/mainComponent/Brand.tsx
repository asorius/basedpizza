import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getAuth, signOut } from 'firebase/auth';

import PizzaCard from '../pizzaCardComponent';
import { BrandObject, PizzaObject } from '../../lib/types';
import Loading from '../../lib/Loading';
import { doc, onSnapshot } from 'firebase/firestore';

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
export default function Main({ brandObjects }: Props) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [isRendering, setRendering] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setRendering(!isRendering), 500);
  }, []);
  if (isRendering) {
    return <Loading />;
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {brandObjects.map((brandItem: BrandObject, i: number) => {
          const pizzaList: PizzaObject[] = brandItem.pizzaList;
          return (
            <Item key={i}>
              <Typography variant='h3' gutterBottom>
                {brandItem.info.name}
              </Typography>
              {pizzaList.map((pizzaItem: PizzaObject, index: number) => {
                const pizzaName = pizzaItem.name;
                return (
                  <PizzaCard
                    key={index}
                    brandInfo={brandItem.info}
                    pizzaItem={pizzaItem}
                    user={user}
                    link={`/pizzas/${brandItem.info.name}/${pizzaName}`}
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
