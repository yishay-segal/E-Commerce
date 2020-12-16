import { Request, Response } from 'express';
import User from '../models/userModel';

export const createOrUpdateUser = async (req: Request, res: Response) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { name: email?.split('@')[0], picture },
    { new: true }
  );

  if (user) {
    console.log('user updated', user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email?.split('@')[0],
      picture,
    }).save();
    console.log('user created', newUser);
    res.json(newUser);
  }
};

export const currentUser = async (req: Request, res: Response) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err.message);
    res.json(user);
  });
};
