import {Schema,model,Document,Types} from 'mongoose'
/**
interface IDish extends Document {
  name: string;
  price: number;
  restaurantId: Types.ObjectId | string;
}

interface ICartDish {
  _id: Types.ObjectId;
  quantity: number;
}

interface ICart extends Document {
  userId: Types.ObjectId | string;
  restaurantId: Types.ObjectId | string;
  dishes: ICartDish[];
}
*/
const cartSchema = new Schema({
	userId:{type:Schema.Types.ObjectId,ref:'User',required:true},
	restaurantId:{type:Schema.Types.ObjectId,ref:'Restaurant',required:true},
	dishes:[{
		dishId:{type:Schema.Types.ObjectId,ref:'Dish'},
		quantity:{type:Number,default:0},
	}],
});

const Cart = model('Cart',cartSchema);
export default Cart ;

