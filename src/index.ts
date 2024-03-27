import dotenv from 'dotenv';

let pathstr = process.env.NODE_ENV==='test'?'var.test.env':'var.env';
dotenv.config({path:pathstr});

import express from "express";
import userRoutes from './routes/userRoutes';
import cartRoutes from './routes/cartRoutes';
import foodRoutes from './routes/foodRoutes';
import paymentRoutes from './routes/paymentRoutes'
import adminRoutes from './routes/adminRoutes'
import cors from 'cors' 
import path from 'path'
const app = express()
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth',userRoutes);
app.use('/cart',cartRoutes);
app.use('/payment',paymentRoutes);
app.use('/admin',adminRoutes);
app.use('/',foodRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
export default app;