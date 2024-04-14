import dotenv from 'dotenv';
let pathstr = process.env.NODE_ENV==='test'?'.test.env':'.env';
dotenv.config({path:pathstr});

if( !process.env.DB_URL  ){
	console.log('Unable to read db_url')
}

if(!process.env.secretKey){
	console.log('Unable to read secretKey')
}

import express from "express";
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'
import cartRoutes from './routes/cartRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import paymentRoutes from './routes/paymentRoutes'
import adminRoutes from './routes/adminRoutes'
import orderRoutes from './routes/orderRoutes'
import driverRoutes from './routes/driverRoutes'

import cors from 'cors' 
import path from 'path'
const app = express()
import {handleWebhookEvent} from './controller/payment'

app.use(cors());

app.use('/payment/webhook', express.raw({type: "*/*"}) ,handleWebhookEvent );

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/restaurant',restaurantRoutes)
app.use('/cart',cartRoutes);
app.use('/payment',paymentRoutes);
app.use('/admin',adminRoutes);
app.use('/order',orderRoutes);
app.use('/user',userRoutes)
app.use('/auth',authRoutes);
app.use('/driver',driverRoutes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
export default app;