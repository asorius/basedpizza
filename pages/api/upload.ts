// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseForm } from '../../lib/form-upload';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
// import { uploadHandler } from '../../firebase/app';
// import formidable from 'formidable';
export const config = { api: { bodyParser: false } };

// ------------------------------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST': {
      console.log('routing req');
      parseForm(req);
      return;
    }
    default:
      res.status(405).json({ err: 'Method not allowed' });
      return;
  }
}
