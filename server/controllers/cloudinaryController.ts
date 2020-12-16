import Cloudinary from 'cloudinary';
import { Request, Response } from 'express';

const cloudinary = Cloudinary.v2;

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = async (req: Request, res: Response) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto',
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

export const remove = (req: Request, res: Response) => {
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (err: any, result: any) => {
    if (err) return res.json({ success: false, err });
    res.send('ok');
  });
};
