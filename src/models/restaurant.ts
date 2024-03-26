import { Document, Schema, model } from 'mongoose';

// Define an interface for the Restaurant document
interface IRestaurant extends Document {
  name: string;
  phone: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  ownerId: Schema.Types.ObjectId;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  ownerId:{type:Schema.Types.ObjectId,ref:'User',required:true},
});

restaurantSchema.pre('save', function (next) {
  // Check if location is empty
  if (!this.location || !this.location.type || !this.location.coordinates) {
    const error = new Error('Location is required.');
    return next(error);
  }
  next();
});
const Restaurant = model<IRestaurant>('Restaurant', restaurantSchema);


Restaurant.collection.createIndex({ location: '2dsphere' });

export default Restaurant;
