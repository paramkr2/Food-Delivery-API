// Import necessary parts from Mongoose
import { Schema, model, Document, Types } from 'mongoose';

// Define interface for the document
interface IRestaurantAddress extends Document {
  restaurantId?: Schema.Types.ObjectId;
  city: string;
  state_district?: string;
  state: string;
  postcode: string;
  neighbourhood?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

const restaurantAddressSchema = new Schema<IRestaurantAddress>({
  // Reference to the user who owns the restaurant (optional)
  restaurantId: { type: Schema.Types.ObjectId , ref:'Restaurant' },
  city: { type: String, required: true },
  state_district: { type: String },
  state: { type: String, required: true },
  postcode: { type: String, required: true },
  neighbourhood: { type: String },
  // Location details for geospatial queries
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
});

restaurantAddressSchema.pre('save', function (next) {
  // Check if location is empty
  if (!this.location || !this.location.type || !this.location.coordinates) {
    const error = new Error('Location is required.');
    return next(error);
  }
  next();
});

// Create a 2dsphere index on the location field for efficient geospatial queries
restaurantAddressSchema.index({ location: '2dsphere' });

// Create the Address model
const RestaurantAddress = model<IRestaurantAddress>('RestaurantAddress', restaurantAddressSchema);

export default RestaurantAddress;
