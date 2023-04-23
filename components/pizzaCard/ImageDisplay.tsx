import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import ImageList from '@mui/material/ImageList';
import Image from 'next/image';
import ImageListItem from '@mui/material/ImageListItem';
import ZoomableImage from './ZoomableImage';
import { createPortal } from 'react-dom';
interface Props {
  imageList: string[];
}
export default function ImageDisplay(props: Props) {
  const [currentImage, setCurrentImage] = React.useState<string>('');
  const [images, updateImages] = React.useState<string[]>([]);
  const [showZoom, setZoom] = React.useState(false);
  React.useEffect(() => {
    const image = props.imageList[0];
    setCurrentImage(image);
    updateImages(props.imageList);
  }, [props.imageList]);
  return (
    <>
      <CardMedia style={{ position: 'relative' }}>
        {currentImage && (
          <Image
            alt='Main Image'
            src={currentImage}
            width={700}
            height={450}
            sizes='100vw'
            style={{
              width: '100%',
              height: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => {
              setZoom(true);
            }}
          />
        )}

        <ImageList
          cols={1}
          style={{ position: 'absolute', inset: 0, top: '50%' }}>
          {images.length > 1 &&
            images.map((url: string, ind: number) => (
              <ImageListItem key={ind}>
                <Image
                  style={{
                    cursor: 'pointer',
                    objectFit: 'contain',
                    background: 'black',
                    border: `${
                      currentImage === url ? '1px solid white' : 'none'
                    }`,
                  }}
                  alt='Mountains'
                  src={url}
                  onClick={() => {
                    setCurrentImage(url);
                  }}
                  width={75}
                  height={50}
                />
              </ImageListItem>
            ))}
        </ImageList>
      </CardMedia>
      {showZoom &&
        currentImage &&
        createPortal(
          <ZoomableImage
            src={currentImage}
            open={showZoom}
            onClose={() => setZoom(false)}
            imageList={images}
          />,
          document.body
        )}
    </>
  );
}
