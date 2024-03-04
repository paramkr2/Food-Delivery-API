import User from '../models/user' ;
import jwt from 'jsonwebtoken' ;
import bcrypt from 'bcrypt' 
const secretkey = process.env.secretkey;
export const login = async (req,res) => {
	try{
		const {username,password} = req.body ;
		// check if  username is unique..
		const user = await User.findOne({username:username});
		if(  !user ){
			return res.status(409).json({
				error:'Incorrect Username'
				})
		}
		// compare password 
		
		// the order here did matter.. 
		const result = await bcrypt.compare(password,user.password);
		if( !result){
				return res.status(401).json({'error':'Password doesnt match'})
		}
		
		const token = jwt.sign({userid:user._id,username:username},
			secretkey,
			{expiresIn:'1h'}
		);
		
		res.status(200).json({'token':token,msg:'Login Successfull'})
	}catch{
		res.status(500).json({'error':'Internal server error'});
	}
};


export const signup = async (req,res) => {
	try{
		const {username,password,email,phone} = req.body;
		
		const existingUser = await User.findOne({username});
		if( existingUser != null ){
			res.status(409).json({"error":'Username already exists'})
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({username,password:hashedPassword,email,phone}) // dont know about address 
		const token = jwt.sign({userid:user._id,username:username},
			secretkey,
			{expiresIn:'1h'}
		);
		res.status(201).json({'token':token,"msg":"User Registered"})
	}catch(error){
		res.status(500).json({"error":`Internal Server Error ${error}`})
	}
}
	
