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
import Loading from '../../utils/Loading';
import ImageDisplay from './ImageDisplay';

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
  const [imageUrls, setImages] = React.useState<string[]>([]);
  React.useEffect(() => {
    const generateUrls = async () => {
      if (!pizzaItem.imageList) {
        console.log('No images available in database');
        return;
      }
      const promiseList = pizzaItem.imageList.map(async (image: any) => {
        const url = await getDownloadURL(ref(storage, image.imageRef));
        return url;
      });
      const urls = await Promise.all(promiseList).then((values) => values);
      setImages(urls);
    };
    generateUrls();
  }, [pizzaItem.imageList]);
  const [isRendering, setRendering] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setRendering(!isRendering), 500);
  }, []);
  if (isRendering) {
    return <Loading />;
  }
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {countryInfo?.name}
        </Typography>
        <Typography gutterBottom variant='h5' component='div'>
          {pizzaItem.name}
        </Typography>
        <Typography gutterBottom variant='h5' component='div'>
          {brandInfo.name}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          {pizzaItem.price}
        </Typography>
        <ImageDisplay imageList={imageUrls}></ImageDisplay>
        {link && (
          <CardActions>
            <Button size='small'>
              <Link href={link}>{link}</Link>
            </Button>
          </CardActions>
        )}
      </CardContent>
      {children}
    </Card>
  );
}
