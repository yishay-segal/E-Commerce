// const express = require('express');
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// import routes
// import authRoutes from './routes/auth';

// app
const app = express();

//db
const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.log(`DB connection err ${err}`));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cors());

// routes middleware
// app.use('/api', authRoutes);
readdirSync('./routes').map(async r => {
  const { default: route } = await import(`./routes/${r.split('.')[0]}`);
  app.use('/api', route);
});

// readdirSync('./routes').map(r =>
//   app.use('/api', require(`./routes/${r.split('.')[0]}`))
// );

// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is runnig on port ${port}`));
