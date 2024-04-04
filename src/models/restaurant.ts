import { Document, Schema, model } from 'mongoose';

// Define an interface for the Restaurant document
interface IRestaurant extends Document {
  name: string;
  phone: number;
  description:string;
  ownerId: Schema.Types.ObjectId;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  description:{type:String},
  ownerId:{type:Schema.Types.ObjectId,ref:'User',required:true},
});


const Restaurant = model<IRestaurant>('Restaurant', restaurantSchema);


Restaurant.collection.createIndex({ location: '2dsphere' });

export default Restaurant;
