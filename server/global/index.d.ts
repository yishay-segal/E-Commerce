import { Types } from 'mongoose';
import admin from '../firebase';

export declare global {
  namespace Express {
    interface Request {
      user: admin.auth.DecodedIdToken;
      params: {
        _id: Types.ObjectId;
        count: string;
        product: string;
      };
      body: {
        slug: string;
        star: number;
      };
    }
  }
}
