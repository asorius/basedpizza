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
export { capitalized, formValidationSchema, formValidationSchemaUser };
