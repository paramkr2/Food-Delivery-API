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
	  phone: '123-456-7890',
	  location:{type:'Point',coordinates:[28.661057,77.211821]}
	};
let token = ""
describe('Integration Test : Auth,Cart, restaurants ' ,  () => {
	let testDish1 ,testDish2 , testDish3;
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
	
	it('Should add 1st item to cart',async() => {
		const mockData = await generateMockData();
		testDish1 = { itemId: mockData.dishes[0]._id, quantity: 1, forceAdd: 0 };
		testDish3 = { itemId: mockData.dishes[1]._id, quantity: 1, forceAdd: 0 };
		testDish2 = { itemId: mockData.dishes[2]._id, quantity: 1, forceAdd: 0 };
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish1)
			expect(res.status).toBe(201);
	});
	
	
	it('Should add end item from same to cart',async() => {
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish3)
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
	
	it('Should Fetch the added dishes', async () => {
		const res = await request(app)
			.get('/cart/fetch')
			.set({Authorization:token})
			
			expect(res.status).toBe(200);
			expect(Object.keys(res.body).length).toBe(1);
	});
	it('Should Update dish quantity',async() => {
		const res = await request(app)
			.put('/cart/update')
			.set({Authorization:token})
			.send({
				dishId:testDish2.itemId,
				quantity:10
			})
			
			expect(res.status).toBe(200)
	})
	it('Should Remove dish from cart' , async() => {
		const res = await request(app)
			.delete('/cart/remove')
			.set({Authorization:token})
			.query({dishId:testDish2.itemId.toString()})
			
			console.log( 'Remove Item', res.body)
			expect(res.status).toBe(200)
	});
	
	let restaurants= []
	it('Should fetch nearby restaurants', async () => {
		let data = { location: { type: 'Point', coordinates: [28.653605, 77.211281] } };
		const res = await request(app)
			.get('/nearbyRestaurants')
			.set({ Authorization: token })
			.query(data);

		expect(res.status).toBe(200);
		restaurants = res.body; // Assuming the response contains an array of restaurants
	});

	it('Should fetch dishes of a restaurant', async () => {
		const res = await request(app)
			.get('/itemsRestaurants')
			.query({ restaurantId: restaurants[0]._id }); // Assuming restaurants variable is defined outside the test

			expect(res.status).toBe(200);
			console.log('fetch dishes', res.body)
			expect(res.body.length).toBeGreaterThan(1);;
	});

	
	it('Should confirm order and Delete Cart ' , async() => {
		const res = await request(app)
			.post('/cart/confirmOrder')
			.set({Authorization:token})
		expect(res.status).toBe(200)
	})
	
	it('Should not confirm when cart empty' , async () => {
		const res = await request(app)
			.post('/cart/confirmOrder')
			.set({Authorization:token})
		expect(res.status).toBe(404)
	})
	
		
});