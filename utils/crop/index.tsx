import React, { useState, useCallback } from 'react';
import Slider from '@mui/material/Slider';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const createImage = (url: any) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));

    image.src = url;
  });
async function getCroppedImg(imageSrc: any, pixelCrop: any) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  const blob: any = await new Promise((resolve, reject) =>
    canvas.toBlob(resolve, 'image/jpeg', 1)
  );
  const imageFile = new File([blob], 'temp', {
    type: blob.type,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob((file: any) => {
      resolve({ imageFile, imageURL: URL.createObjectURL(file) });
    }, 'image/jpeg');
  });
}

const ImageCropper = ({ sourceImage, open, onClose, setCroppedImage }: any) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  //   const [croppedImage, setCroppedImage] = useState<any>(null);
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby='modal-crop-image'
      aria-describedby='modal-encroped-image'
      closeAfterTransition
      slots={{ backdrop: Backdrop }}>
      <Fade in={open}>
        <Box
          sx={{ width: '50vw', margin: '0 auto', border: '1px solid black' }}>
          <Box position={'relative'} sx={{ height: '100vh', width: '100%' }}>
            <Cropper
              image={sourceImage}
              crop={crop}
              zoom={zoom}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              zoomWithScroll={true}
              zoomSpeed={0.2}
              //   cropSize={{ width: '70%', height: '70%' }}
              aspect={4 / 4}
              style={{ cropAreaStyle: { background: 'transparent' } }}
              restrictPosition={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: '50%',
              transform: ' translateX(-50%)',
              height: '10rem',
              display: 'flex',
              background: 'white',
              padding: '1rem',
              alignIitems: 'center',
            }}>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='stretch'
              spacing={2}>
              <Grid item>
                <Slider
                  value={zoom}
                  max={MAX_ZOOM}
                  min={MIN_ZOOM}
                  step={0.1}
                  aria-labelledby='Zoom'
                  onChange={(e, zoom) => setZoom(Number(zoom))}
                  classes={{ root: 'slider' }}
                />
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justifyContent='center'
                  alignItems='center'
                  spacing={8}>
                  <Grid item>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<CheckIcon />}
                      onClick={async (e) => {
                        e.preventDefault();
                        const croppedImage = await getCroppedImg(
                          sourceImage,
                          croppedAreaPixels
                        );
                        onClose();
                        setCroppedImage(croppedImage);
                      }}>
                      Crop
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant='outlined'
                      startIcon={<CancelIcon />}
                      onClick={async (e) => {
                        e.preventDefault();

                        onClose();
                      }}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImageCropper;
