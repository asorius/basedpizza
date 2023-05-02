import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import { storage } from '../../firebase/application';
import { ref, getDownloadURL } from 'firebase/storage';
import {
  BrandData,
  BrandObject,
  CountryData,
  PizzaObject,
} from '../../utils/types';
import { flagIcon } from '../../utils';
import ImageDisplay from './ImageDisplay';
import Grid from '@mui/material/Grid';

interface Props {
  countryInfo?: CountryData;
  brandInfo: BrandData;
  pizzaItem: PizzaObject;
  link?: any;
  user?: any;
  children?: React.ReactNode;
}
export default function PizzaCard({
  countryInfo,
  brandInfo,
  pizzaItem,
  link,
  user,
  children,
}: Props) {
  // const [imageUrls, setImages] = React.useState<string[]>([]);
  // React.useEffect(() => {
  //   const generateUrls = async () => {
  //     if (!pizzaItem.imageList) {
  //       console.log('No images available in database');
  //       return;
  //     }
  //     const promiseList = pizzaItem.imageList.map(async (image: any) => {
  //       const url = await getDownloadURL(ref(storage, image.imageRef));
  //       return url;
  //     });
  //     const urls = await Promise.all(promiseList).then((values) => values);
  //     setImages(urls);
  //   };
  //   generateUrls();
  // }, [pizzaItem.imageList]);

  // if (!imageUrls.length) {
  //   return <Loading />;
  // }
  return (
    <Card sx={{ maxWidth: '30rem' }}>
      <Grid container mt={4} alignItems='center' justifyContent='center'>
        <Grid item>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Typography gutterBottom variant='h2' align='center'>
                  {pizzaItem.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction='column'
                  justifyContent='center'
                  alignItems='stretch'>
                  <Typography variant='h4' align='center'>
                    {brandInfo.name}
                  </Typography>
                  <Typography variant='h5' align='center'>
                    {/* <Image */}
                    {countryInfo && (
                      <>
                        <img
                          width='20'
                          style={{ marginRight: '1rem' }}
                          src={flagIcon(countryInfo.name).src}
                          srcSet={flagIcon(countryInfo.name).srcSet}
                          alt=''
                        />
                        {countryInfo.name}
                      </>
                    )}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {pizzaItem.price}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <ImageDisplay imageList={pizzaItem.imageList}></ImageDisplay>
            {link && (
              <CardActions>
                <Button size='small'>
                  <Link href={link}>{link}</Link>
                </Button>
              </CardActions>
            )}
          </CardContent>
          <Grid container direction='column' alignContent='center' mb={14}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
