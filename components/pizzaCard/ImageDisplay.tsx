import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import ImageList from '@mui/material/ImageList';
import Image from 'next/image';
import ImageListItem from '@mui/material/ImageListItem';
import ZoomableImage from './ZoomableImage';
import { createPortal } from 'react-dom';
import { ImageObject } from 'utils/types';
import Loading from 'utils/Loading';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase/application';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
interface Props {
  imageList: ImageObject[];
}
export default function ImageDisplay(props: Props) {
  const [currentImageIdx, setCurrentImage] = React.useState<number>(0);
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [showZoom, setZoom] = React.useState(false);
  React.useEffect(() => {
    console.log(props.imageList);
    const generateUrls = async () => {
      if (!props.imageList) {
        console.log('No images available in database');
        return;
      }
      const promiseList = props.imageList.map(async (image: any) => {
        const url = await getDownloadURL(ref(storage, image.imageRef));
        return url;
      });
      const urls = await Promise.all(promiseList).then((values) => values);
      setImageUrls(urls);
    };
    generateUrls();
  }, [props.imageList]);
  if (imageUrls.length < 1) {
    return <Loading />;
  }
  return (
    <>
      <CardMedia style={{ position: 'relative' }}>
        <Box
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: 1,
            overflow: 'hidden',
          }}>
          <Image
            alt='Main Image'
            src={imageUrls[currentImageIdx]}
            // width={700}
            fill
            // height={450}
            // sizes='100vw'
            style={{
              // width: '100%',
              // height: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => {
              setZoom(true);
            }}
          />
          <Chip
            variant='filled'
            sx={{
              position: 'absolute',
              right: '-1.8rem',
              bottom: '10%',
              paddingRight: '2rem',
            }}
            color='info'
            // size='small'
            label={
              props.imageList[currentImageIdx].timeStamp.split('T')[0]
            }></Chip>
        </Box>
        <Divider />
        <ImageList
          style={{
            border: '1px solid black',
            display: 'flex',
            backgroundColor: 'black',
            gap: '1rem',
            overflowX: 'scroll',
          }}>
          {props.imageList.length > 1 &&
            props.imageList.map((imageObject: ImageObject, ind: number) => (
              <ImageListItem key={ind} sx={{ position: 'relative' }}>
                <Image
                  style={{
                    cursor: 'pointer',
                    objectFit: 'contain',
                    background: 'black',
                    border: `${
                      currentImageIdx === ind
                        ? '2px solid mediumSeaGreen'
                        : 'none'
                    }`,
                  }}
                  alt=''
                  src={imageUrls[ind] || ''}
                  onClick={() => {
                    setCurrentImage(ind);
                  }}
                  width={75}
                  height={50}
                />
              </ImageListItem>
            ))}
        </ImageList>
      </CardMedia>
      {showZoom &&
        createPortal(
          <ZoomableImage
            src={imageUrls[currentImageIdx]}
            open={showZoom}
            onClose={() => setZoom(false)}
            imageList={imageUrls}
          />,
          document.body
        )}
    </>
  );
}
