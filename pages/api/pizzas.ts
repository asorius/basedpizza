// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import * as dotenv from 'dotenv';
import Pizza from '../../mongoDB/models/pizza';
import mongoose from 'mongoose';
dotenv.config();
//mongoose upcoming update fix
mongoose.set('strictQuery', false);

const mongo_uri = process.env.MONGODB_URI;
const connectToMongo = async () => {
  try {
    mongo_uri && mongoose.connect(mongo_uri);
  } catch (e) {
    console.log(e);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  connectToMongo().then(async () => {
    switch (req.method) {
      case 'GET': {
        const list = await Pizza.find();
        res.status(200).json({ success: true });
        return;
      }

      default:
        res.status(405).json({ err: 'Method not allowed' });
        return;
    }
  });
}
