import Restaurant from '../models/restaurant';
import RestaurantAddress from '../models/restaurantAddress';
import Address from '../models/address';
import Dish from '../models/dish'
import axios from 'axios';

export const nearbyRestaurants = async (req, res) => {
  try {
    const { location } = req.query;
    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lat,location.lng],
          },
          $maxDistance: 100000, // Set your maximum distance for nearby locations
        },
      },
    };

    // Getting a list of nearby restaurants
    const restaurants = await RestaurantAddress.find(query);

    // Get travel time for each restaurant
    const restaurantPromises = restaurants.map(async (restaurant) => {
    const { coordinates } = restaurant.location;
    const userLocation = [location.lat,location.lng];

    try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${coordinates[1]},${coordinates[0]}`
        );
		
		// fetch restarant 
		const restInfo = await Restaurant.findById(restaurant.restaurantId );
        return {
          ...restInfo.toJSON(),
          travelTime: response.data.routes[0].duration, // Assuming you're interested in travel time
        };
      } catch (error) {
        console.error('Error fetching travel time:', error);
        return restaurant.toJSON();
      }
    });

    const restaurantResults = await Promise.all(restaurantPromises);

    console.log('In nearbyRestaurants', restaurantResults);
    return res.status(200).json(restaurantResults);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


export const itemsRestaurants = async (req,res) => {
	try {
		const { restaurantId } = req.query;
		console.log('In itemsRestaurants', restaurantId)
		// Search for dishes based on the provided restaurant ID
		const dishes = await Dish.find({ restaurantId });
		res.status(200).json(dishes);
  } catch (err) {
		console.error(err);
		res.status(500).send({ error: 'Internal Server Error' });
  }
}

export const getAddress = async (req, res) => {
  try {
	const restaurantId = req.params.restaurantId || res.locals.restaurantId;
    const address = await RestaurantAddress.findOne({restaurantId}); // its not its id shit
	
    if (!address) {
      return res.status(404).send({ error: 'Address or Restaurant not found ' });
    }
	
    res.status(200).send(address);
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export const addressUpdate = async (req, res) => {
    try {
        const { restaurantId } = res.locals; 
		console.log( 'addressupdate restaurant', restaurantId )
        const { city, state_district, state, postcode, neighbourhood, location } = req.body;
        let address = await RestaurantAddress.findOne({ restaurantId });

        if (!address) {
            // If address doesn't exist, create a new one
            address = await RestaurantAddress.create({
                restaurantId,
                city,
                state_district,
                state,
                postcode,
                neighbourhood,
                location
            });
        } else {
            // If address exists, update it
            address.set({
                city,
                state_district,
                state,
                postcode,
                neighbourhood,
                location
            }); // Update only the specified fields
            await address.save();
        }

        return res.status(200).send(address);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
};

