import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest } from 'next';
import { Writable } from 'stream';
import { uploadHandler } from '../firebase/application';
// const cb = (file: any) => console.log(file);
const myWrite = new Writable({
  write(chunk, encoding, cb) {
    console.log(chunk.toString());
  },
});
export const FormidableError = formidable.errors.FormidableError;
export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const form = formidable({
      allowEmptyFiles: false,
      filter: (part) => {
        return part.mimetype?.includes('image') || false;
      },
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ files, fields });
      }
    });
  });
};
