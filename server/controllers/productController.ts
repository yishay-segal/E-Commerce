import { Request, Response } from 'express';
import Product from '../models/productModel';
import User from '../models/userModel';

import slugify from 'slugify';
import { constants } from 'buffer';
import { Types } from 'mongoose';

interface listIn {
  order: string;
  sort: string;
  page: number;
}

export const create = async (req: Request, res: Response) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    // res.status(400).send('Create product failed');
    res.status(400).json({
      err: error.message,
    });
  }
};

export const listAll = async (req: Request, res: Response) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']])
    .exec();
  res.json(products);
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Product delete failed');
  }
};

export const read = async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec();
  res.json(product);
};

export const update = async (req: Request, res: Response) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (error) {
    console.log('PRODUCT UPDATE ERROR', error);
    res.status(400).json({
      err: error.message,
    });
  }
};

// without peg
// export const list = async (req: Request, res: Response) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body as listIn;
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (error) {
//     console.log(error);
//   }
// };

//with pagination
export const list = async (req: Request, res: Response) => {
  try {
    // createdAt/updatedAt, desc/asc, 3
    const { sort, order, page } = req.body as listIn;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

export const productsCount = async (req: Request, res: Response) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

export const productStar = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  // who is updating
  //check if currently logged in user have already added rating to this product?
  let existingRatingObject = product?.ratings.find(
    elem => elem.postedBy.toString() === user?._id.toString()
  );

  // if user haven't left rating yet, push it
  if (!existingRatingObject) {
    const ratingAdded = await Product.findByIdAndUpdate(
      product?._id,
      {
        $push: { ratings: { star, postedBy: user?._id } },
      },
      { new: true }
    ).exec();

    console.log('ratingAdded', ratingAdded);
    res.json(ratingAdded);
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      { $set: { 'ratings.$.star': star } },
      { new: true }
    ).exec();
    console.log('ratingUpdated', ratingUpdated);
    res.json(ratingUpdated);
  }
};

export const listRelated = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product?._id },
    category: product?.category,
  })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

  res.json(related);
};

interface Filters {
  query: string;
  price: number[];
  category: [];
  stars: number;
  sub: [];
  shipping: string;
  color: any;
  brand: any;
}

const handleQuery = async (req: Request, res: Response, query: string) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handlePrice = async (req: Request, res: Response, price: number[]) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json(products);
  } catch (error) {
    console.error(error);
  }
};

const handleCategory = async (req: Request, res: Response, category: any) => {
  try {
    let products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json(products);
  } catch (error) {
    console.error(error);
  }
};

const handleStar = (req: Request, res: Response, stars: number) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.error('aggregate error', err);
      Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
          if (err) console.error('product aggregate error', err);
          res.json(products);
        });
    });
};

const handleSub = async (req: Request, res: Response, sub: any) => {
  const products = await Product.find({ subs: sub })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleShipping = async (req: Request, res: Response, shipping: any) => {
  const products = await Product.find({ shipping })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleColor = async (req: Request, res: Response, color: any) => {
  const products = await Product.find({ color })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleBrand = async (req: Request, res: Response, brand: any) => {
  const products = await Product.find({ brand })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

//serach/ filter
export const searchFilters = async (req: Request, res: Response) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    brand,
    color,
  }: Filters = req.body;

  if (query) {
    await handleQuery(req, res, query);
  }

  // price [start, end]
  if (price) {
    console.log('price ---', price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log('category ---', category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log('stars ---', stars);
    await handleStar(req, res, stars);
  }

  if (sub) {
    console.log('sub---', sub);
    await handleSub(req, res, sub);
  }

  if (shipping) {
    console.log('shipping --->', shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log('color --->', color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log('brand --->', brand);
    await handleBrand(req, res, brand);
  }
};
