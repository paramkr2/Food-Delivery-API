import { Schema, model } from 'mongoose';

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String }, // Corrected the type to String
});

const Restaurant = model('Restaurant', restaurantSchema);
export default Restaurant;
