import Image from 'next/image';
import React from 'react';
import ImageCropper from '../utils/crop';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CropIcon from '@mui/icons-material/Crop';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
interface Props {
  image: File | null;
  updateFunc: (arg: File) => void;
  deleteFunc: (arg: string) => void;
}
interface CropsUpdateProps {
  imageFile: File;
  imageURL: string;
}
export default function ImagePreview({ image, updateFunc, deleteFunc }: Props) {
  const [cropOpen, setCropOpen] = React.useState(false);
  const [croppedImage, setCroppedImage] = React.useState<string | null>(null);
  const imageHandler = (props: CropsUpdateProps) => {
    setCroppedImage(props.imageURL);
    updateFunc(props.imageFile);
  };
  return (
    <Grid mt={6} sx={{ minHeight: '20rem' }}>
      {image && (
        <Box
          key={image.name}
          position='relative'
          style={{
            width: '100%',
            aspectRatio: 1,
            maxWidth: '30rem',
          }}>
          <Image
            src={croppedImage ? croppedImage : URL.createObjectURL(image)}
            alt='preview'
            fill
            style={{ objectFit: 'contain' }}
          />
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            spacing={3}>
            <IconButton
              aria-label='delete'
              color='warning'
              style={{
                position: 'absolute',
                right: -10,
                bottom: 0,
              }}
              onClick={() => deleteFunc(image.name)}>
              <DeleteForeverIcon />
            </IconButton>

            <IconButton
              aria-label='crop image'
              color='secondary'
              style={{
                position: 'absolute',
                right: 30,
                bottom: 0,
              }}
              onClick={(e) => {
                e.preventDefault();
                setCropOpen(true);
              }}>
              <CropIcon />
            </IconButton>
          </Grid>
        </Box>
      )}
      {image && (
        <ImageCropper
          sourceImage={URL.createObjectURL(image)}
          imageName={image.name}
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          setCroppedImage={imageHandler}
        />
      )}
    </Grid>
  );
}
