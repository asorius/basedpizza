import React from 'react';
import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Image from 'next/image';
type Props = {
  src: string;
  open: boolean;
  onClose: () => void;
};
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
const ZoomableImage = ({ src, onClose, open }: Props) => {
  const [zoomStatus, setZoomStatus] = React.useState(false);
  const [startingPosition, setStartingPosition] = React.useState({
    x: 0,
    y: 0,
  });
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
          imageRef.current.style.position = 'absolute';
          imageRef.current.style.left = 4 * moveDistanceX + 'px';
          imageRef.current.style.top = 4 * moveDistanceY + 'px';
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
    //offsetleft is parent coords(not changing?)
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
          imageRef.current.style.position = 'absolute';
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
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(350px,80vw,100rem)',
    aspectRatio: '2',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    overflow: 'hidden',
    boxShadow: 24,
    cursor: 'zoom-in',
    p: 4,
  };
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby='modal-large-image'
      aria-describedby='modal-enlarged-image'
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      // slotProps={ }
    >
      <Fade in={open}>
        <Box
          sx={style}
          // onMouseEnter={() => setZoomStatus(true)}
          onMouseLeave={() => setZoomStatus(false)}
          onClick={(e) => {
            initZoom(e);
            setZoomStatus(!zoomStatus);
          }}
          onMouseMove={handleMouseMove}>
          <Image
            ref={imageRef}
            src={src}
            alt=''
            fill
            // style={{ width: zoomedWidth, height: zoomedHeight }}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default ZoomableImage;
