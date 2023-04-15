import Image from 'next/image';
import React from 'react';
interface Props {
  image: File | null;
  deleteFunc: (arg: string) => void;
}
export default function ImagePreview({ image, deleteFunc }: Props) {
  // TODO: ADD DELETE FUNCTIONALITY ON IMAGE PREVIEW
  // IDEA: PROVIDE GRAY PIZZA BASE IMAGE PLACEHOLDER FOR PREVIEW CONTAINER
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
            src={URL.createObjectURL(image)}
            alt='preivwe'
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
        </div>
      )}
    </div>
  );
}
