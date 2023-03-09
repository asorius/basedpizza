import * as yup from 'yup';

const capitalized = (word = '') => word.charAt(0).toUpperCase() + word.slice(1);
const formValidationSchema = yup
  .object({
    name: yup.string().min(3).max(30).required(),
    brand: yup.string().min(6).max(30).required(),
    price: yup
      .mixed()
      .test('price', 'Price must be provided', (val) => +val > 0 && +val < 50),
    image: yup.mixed().required('Photo must be provided'),
  })
  .required();
const formValidationSchemaUser = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(30).required(),
  })
  .required();
const compressImage = async (
  file: File,
  { quality = 1, type = 'image/jpeg' }
) => {
  // Get as image data
  const imageBitmap = await createImageBitmap(file);

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext('2d');
  if (canvas && ctx) {
    ctx.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    const blob: any = await new Promise((resolve, reject) =>
      canvas.toBlob(resolve, type, quality)
    );
    // Turn Blob into File

    return new File([blob], file.name, {
      type: blob.type,
    });
  }
};
export {
  capitalized,
  formValidationSchema,
  formValidationSchemaUser,
  compressImage,
};
