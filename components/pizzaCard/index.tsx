import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import { storage } from '../../firebase/app';
import { ref, getDownloadURL } from 'firebase/storage';
import { BrandData, BrandObject, PizzaObject } from '../../lib/types';
import ImageDisplay from './ImageDisplay';

interface Props {
  brandInfo: BrandData;
  pizzaItem: PizzaObject;
  link?: any;
}
export default function PizzaCard({ brandInfo, pizzaItem, link }: Props) {
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
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {pizzaItem.pizzaName}
        </Typography>
        <Typography gutterBottom variant='h5' component='div'>
          {brandInfo.brandName}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {pizzaItem.price}
        </Typography>
        {/* <img src={ } /> */}
        <ImageDisplay imageList={imageUrls}></ImageDisplay>
        {/* {imageUrls.map((url: string, ind: number) => (
          <Image
            alt='Mountains'
            key={ind}
            src={url}
            width={700}
            height={475}
            sizes='100vw'
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        ))} */}
      </CardContent>
      {link && (
        <CardActions>
          <Button size='small'>
            <Link href={link}>{link}</Link>
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
