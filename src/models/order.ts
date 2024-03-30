import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    dishId: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
    quantity: { type: Number, required: true, default: 1 } // Quantity of the dish in the order
  }],
  totalAmount: { type: Number ,required:true },
  delivered: { type: Boolean,default:false },
  status:{type:String,enum:['Pending','Preparing','Delivery','Delivered'] , default:'Pending'} ,
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentIntentId: { type: String }, // Payment intent ID provided by the payment gateway
  createdAt: { type: Date, default: Date.now } // Creation date of the order
  // You can add more payment-related fields as needed, like payment date, payment gateway details, etc.
});
orderSchema.index({ created_at: -1 });
const Order = model('Order', orderSchema);

export default Order;
