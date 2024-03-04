import {Schema,model} from 'mongoose'

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

