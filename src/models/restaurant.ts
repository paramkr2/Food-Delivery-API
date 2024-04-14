import { Document, Schema, model } from 'mongoose';

// Define an interface for the Restaurant document
interface IRestaurant extends Document {
  name: string;
  phone: number;
  description:string;
  ownerId: Schema.Types.ObjectId;
  imagePath:string;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  description:{type:String},
  ownerId:{type:Schema.Types.ObjectId,ref:'User',required:true},
  imagePath:{type:String}
});


const Restaurant = model<IRestaurant>('Restaurant', restaurantSchema);


export default Restaurant;
