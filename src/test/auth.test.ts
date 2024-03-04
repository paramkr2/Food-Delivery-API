import request from 'supertest';
import app from '../index'
import dbconnect from '../db/db'
import mongoose from 'mongoose'
import {generateMockData} from './load_dish_data';

  
const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]; // Fix: Use square brackets
    await collection.deleteMany({});
  }
};


beforeAll(async () => {
  await dbconnect();
  await clearDatabase();
},10000);

afterAll( async () => {
	await mongoose.connection.close();
});

const exampleUser = {
	  username: 'john_doe',
	  email: 'john.doe@example.com',
	  password: 'secure_password',
	  phone: '123-456-7890'
	};
let token = ""
describe('Test Signup -> login ' ,  () => {
	let testDish1 ,testDish2 ;
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
			token = res.body.token ;
	});
	it('should return username error', async() =>{
		const res = await request(app)
			.post('/auth/login')
			.send({username:'rohitsharma',password:'pass'})
			
			expect(res.status).toBe(409);
	})
	
	it('Should add items to cart',async() => {
		const mockData = await generateMockData();
		testDish1 = { itemId: mockData.dishes[0]._id, quantity: 1, forceAdd: 0 };
		testDish2 = { itemId: mockData.dishes[2]._id, quantity: 1, forceAdd: 0 };
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish1)
			expect(res.status).toBe(201);
	});
	
	it('Should give error on diffrent resturant if not forceAdd', async () => {
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish2)
			expect(res.status).toBe(405);
	});
	it('Should add on diffrent resturant if forceAdd', async () => {
		testDish2.forceAdd = 1 
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish2)
			expect(res.status).toBe(201);
	});
		
});