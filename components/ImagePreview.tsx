import Image from 'next/image';
import React from 'react';
import ImageCropper from '../utils/crop';
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
    // console.log(image);
    setCroppedImage(props.imageURL);
    updateFunc(props.imageFile);
  };
  return (
    <div>
      {image && (
        <div
          key={image.name}
          style={{
            position: 'relative',
            height: '400px',
            width: 600 + 'px',
          }}>
          <Image
            src={croppedImage ? croppedImage : URL.createObjectURL(image)}
            alt='preview'
            fill
            style={{ objectFit: 'contain' }}
          />
          <span
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              cursor: 'pointer',
            }}
            onClick={() => deleteFunc(image.name)}>
            ❌
          </span>
          <button
            style={{
              position: 'absolute',
              right: 30,
              bottom: 10,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault();
              console.log('what');
              setCropOpen(true);
            }}>
            crop
          </button>
        </div>
      )}
      {image && (
        <ImageCropper
          sourceImage={URL.createObjectURL(image)}
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          setCroppedImage={imageHandler}
        />
      )}
    </div>
  );
}
