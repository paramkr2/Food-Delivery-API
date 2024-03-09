import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  dishes: [{ type: Schema.Types.ObjectId, ref: 'Dish' }],
  totalAmount: { type: Number },
  delivered: { type: Boolean, required: true },
});

const Order = model('Order', orderSchema);

export default Order;
