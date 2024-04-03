import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  restaurantOwner:{type:Boolean ,required:true,default:false}
});



const User = model('User', userSchema);

export default User;
