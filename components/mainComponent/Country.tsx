// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
// import { getAuth, signOut } from 'firebase/auth';

// import MainList from '../MainList';
// import { BrandObject, PizzaObject } from '../../lib/types';
// import Loading from '../../lib/Loading';
// import { doc, onSnapshot } from 'firebase/firestore';
// import { CountryObject } from 'lib/types';
// import Brand from './Brand';
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));
// interface Props {
//   countryObject: CountryObject;
// }
// export default function Country({ countryObject }: Props) {
//   const [isRendering, setRendering] = React.useState(true);

//   React.useEffect(() => {
//     setTimeout(() => setRendering(!isRendering), 500);
//   }, []);
//   if (isRendering) {
//     return <Loading />;
//   }
//   return (
//     <Box sx={{ width: '100%' }}>
//       <Stack spacing={2}>
//         {countryObject.brandsList.map(
//           (countryItem: CountryObject, i: number) => {
//             const brandsList: BrandObject[] = countryItem.brandsList;
//             return (
//               <Item key={i}>
//                 <Typography variant='h3' gutterBottom>
//                   {countryItem.info.name}
//                 </Typography>
//                 <Brand brandObjects={brandsList}></Brand>
//               </Item>
//             );
//           }
//         )}
//       </Stack>
//     </Box>
//   );
// }
