import mongoose , { ConnectOptions} from 'mongoose';

console.log('db url read ', process.env.DB_URL);
export default async () =>{
	try{
		await mongoose.connect(process.env.DB_URL, {
		  useNewUrlParser: true,
		  useUnifiedTopology: true,
		}  as ConnectOptions);
		console.log('DB Connected');
	}catch{
		console.log('Error connecting to Databse');
	}
}

