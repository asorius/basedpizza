import React from 'react';
import { Box, Modal, ImageList, ImageListItem } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Image from 'next/image';
type Props = {
  src: string;
  open: boolean;
  onClose: () => void;
  imageList: string[];
};
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 'clamp(350px,75%,100rem)',
  width: 'clamp(350px,95%,70rem)',
  aspectRatio: '2',
  bgcolor: '#000',
  border: '2px solid #000',
  overflow: 'hidden',
  boxShadow: 24,
  cursor: 'zoom-in',
  p: 4,
};
const ZoomableImage = ({ src, onClose, open, imageList }: Props) => {
  const [zoomStatus, setZoomStatus] = React.useState(false);
  const [startingPosition, setStartingPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const [currentImage, setCurrentImage] = React.useState<string | null>(null);

  const imageRef = React.useRef<HTMLImageElement>(null);
  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const imageContainer = event.currentTarget;
    const { left, top, width, height } = imageContainer.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const moveDistanceX = x - left - startingPosition.x;
    const moveDistanceY = y - top - startingPosition.y;
    // console.log(moveDistanceX, moveDistanceY);
    if (imageRef) {
      if (imageRef.current) {
        if (imageContainer.contains(imageRef.current) && zoomStatus) {
          imageRef.current.style.left = 2 * moveDistanceX + 'px';
          imageRef.current.style.top = 2 * moveDistanceY + 'px';
        } else {
          imageRef.current.style.transform = `scale(1)`;
          imageRef.current.style.left = '0';
          imageRef.current.style.top = '0';
          imageRef.current.style.cursor = 'zoom-in';
        }
      }
    }
  };
  const initZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const current = e.currentTarget;
    //clientx is global screen
    const x = e.clientX;
    const y = e.clientY;
    //offsetleft is parent coords(not changing)
    const parentX = current.offsetLeft;
    const parentY = current.offsetTop;
    const positionCoords = {
      x: x - parentX + current.offsetWidth / 2,
      y: y - parentY + current.offsetHeight / 2,
    };
    setStartingPosition(positionCoords);

    if (imageRef) {
      if (imageRef.current) {
        if (zoomStatus === false) {
          // console.log(x?);
          imageRef.current.style.transition = 'transform 0.3s';
          imageRef.current.style.transform = `scale(2)`;
          imageRef.current.style.cursor = 'move';
        } else {
          imageRef.current.style.transform = `scale(1)`;
          imageRef.current.style.left = '0';
          imageRef.current.style.top = '0';
          imageRef.current.style.cursor = 'zoom-in';
        }
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby='modal-large-image'
      aria-describedby='modal-enlarged-image'
      closeAfterTransition
      slots={{ backdrop: Backdrop }}>
      <Fade in={open}>
        <div>
          <Box
            sx={style}
            onMouseLeave={() => setZoomStatus(false)}
            onClick={(e) => {
              initZoom(e);
              setZoomStatus(!zoomStatus);
            }}
            onMouseMove={handleMouseMove}>
            <Image
              ref={imageRef}
              src={currentImage || src}
              alt=''
              fill
              style={{
                objectFit: 'contain',
              }}
            />
          </Box>
          <ImageList
            cols={1}
            style={{
              position: 'absolute',
              inset: 0,
              top: '50%',
              left: '2%',
              width: '5rem',
              height: '25%',
            }}>
            {imageList.map((url: string, ind: number) => (
              <ImageListItem key={ind}>
                <Image
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
        </div>
      </Fade>
    </Modal>
  );
};

export default ZoomableImage;
