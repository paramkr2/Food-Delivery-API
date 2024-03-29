import {Schema,model} from 'mongoose'

const dishSchema = new Schema({
	name:{type:String,required:true},
	price:{type:Number,required:true},
	restaurantId:{type:Schema.Types.ObjectId,required:true},
	description:{type:String},
	imagePath:{type:String}
});

const Dish = model('Dish',dishSchema);
export default Dish ;