import request from 'supertest';
import app from '../index'
import dbconnect from '../db/db'
import mongoose from 'mongoose'


  
const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]; // Fix: Use square brackets
    await collection.deleteMany({});
  }
};

beforeAll( async () => {
	await dbconnect();
	await clearDatabase();
});

afterAll( async () => {
	await mongoose.connection.close();
});
const exampleUser = {
	  username: 'john_doe',
	  email: 'john.doe@example.com',
	  password: 'secure_password',
	  phone: '123-456-7890'
	};

describe('Test Signup -> login ' ,  () => {
	it('should signup new user' , async () => {
		const res = await request(app)
			.post('/auth/signup')
			.send(exampleUser)
		console.log('Signup Response' , res.body);
		expect(res.status).toBe(201)
	});
	
	it('should login the existin user', async() =>{
		const res = await request(app)
			.post('/auth/login')
			.send(exampleUser)
			console.log('login response',res.body);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
	});
	it('should return username error', async() =>{
		const res = await request(app)
			.post('/auth/login')
			.send({username:'rohitsharma',password:'pass'})
			
			expect(res.status).toBe(409);
	})
});