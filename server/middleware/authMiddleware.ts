import { NextFunction, Request, Response } from 'express';
import { storage } from 'firebase-admin';
import admin from '../firebase';
import User from '../models/userModel';

interface AuthRequest extends Request {
  headers: {
    authtoken?: string;
  };
}

export const authCheack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.headers);
  try {
    const authtoken = (req as AuthRequest).headers.authtoken!;
    const firebaseUser = await admin.auth().verifyIdToken(authtoken);
    // console.log('firebase user in authcheck', firebaseUser);
    req.user = firebaseUser;
  } catch (error) {
    console.log(error);
    res.status(401).json({
      err: 'Invalid or expired token',
    });
  }
  next();
};

export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser?.role !== 'admin') {
    res.status(403).json({
      err: 'Admin resource. Access deined',
    });
  } else {
    next();
  }
};
