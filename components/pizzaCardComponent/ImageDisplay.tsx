import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import ImageList from '@mui/material/ImageList';
import Image from 'next/image';
import ImageListItem from '@mui/material/ImageListItem';
interface Props {
  imageList: string[];
}
export default function ImageDisplay(props: Props) {
  const [currentImage, setCurrentImage] = React.useState<string>('');
  const [images, updateImages] = React.useState<string[]>([]);
  React.useEffect(() => {
    const image = props.imageList[0];
    setCurrentImage(image);
    updateImages(props.imageList);
  }, [props.imageList]);
  return (
    <CardMedia style={{ position: 'relative' }}>
      {currentImage ? (
        <Image
          alt='Main Image'
          src={currentImage}
          width={700}
          height={450}
          sizes='100vw'
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      ) : (
        'loading'
      )}
      <ImageList
        cols={1}
        style={{ position: 'absolute', inset: 0, top: '50%' }}>
        {images.map((url: string, ind: number) => (
          <ImageListItem key={ind}>
            <Image
              style={{
                cursor: 'pointer',
                border: `${currentImage === url ? '1px solid white' : 'none'}`,
              }}
              alt='Mountains'
              src={url}
              onClick={() => {
                console.log('clicked ' + url);
                setCurrentImage(url);
              }}
              width={75}
              height={50}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </CardMedia>
  );
}
