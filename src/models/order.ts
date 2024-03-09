import {Schema,model} from 'mongoose'

const orderSchema = Schema({
	userid:{type:Schema.Types.ObjectId,ref:'User',required:true},
	restaurantid:{type:Schema.Types.ObjectId,ref:'Restaurant',required:true},
	dishes:[{type:Schema.Types.ObjectId,ref:'Dish'}],
	totalAmount:{type:Number},
	completed:{type:boolean,required:true},
}]

const Order = model('Order',orderSchema);
export default Order ;