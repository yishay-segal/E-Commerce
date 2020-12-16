import { Request, Response } from 'express';
import Category from '../models/categoryModel';
import Product from '../models/productModel';
import Sub from '../models/subModel';
import slugify from 'slugify';
import { Types } from 'mongoose';

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name).toLocaleLowerCase(),
    }).save();
    res.json(category);
  } catch (error) {
    res.status(400).send('Create category failed');
  }
};

export const list = async (req: Request, res: Response) => {
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
};

export const read = async (req: Request, res: Response) => {
  let category = ((await Category.findOne({
    slug: req.params.slug,
  }).exec()) as unknown) as Types.ObjectId;

  const products = await Product.find({ category }).populate('category').exec();

  res.json({
    category,
    products,
  });
};

export const update = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send('Update failed');
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json({
      data: deleted,
      message: 'category deleted',
    });
  } catch (error) {
    res.status(400).send('Delete failed');
  }
};

export const getSubs = (req: Request, res: Response) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err);
    res.json(subs);
  });
};
