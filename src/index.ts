import dotenv from 'dotenv';

let pathstr = process.env.NODE_ENV==='test'?'var.test.env':'var.env';
dotenv.config({path:pathstr});

import express from "express";
import userRoutes from './routes/userRoutes';
import cartRoutes from './routes/cartRoutes';
import cors from 'cors' 

const app = express()
app.use(cors());
app.use(express.json());

app.use('/auth',userRoutes);
app.use('/cart',cartRoutes);

export default app;