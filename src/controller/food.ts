import Restaurant from '../models/restaurant';
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
            coordinates: location.coordinates || [0, 0],
          },
          $maxDistance: 10000, // Set your maximum distance for nearby locations
        },
      },
    };

    // Getting a list of nearby restaurants
    const restaurants = await Restaurant.find(query);

    // Get travel time for each restaurant
    const restaurantPromises = restaurants.map(async (restaurant) => {
      const { coordinates } = restaurant.location;
      const userLocation = location.coordinates;

      try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${coordinates[1]},${coordinates[0]}`
        );

        return {
          ...restaurant.toJSON(),
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
	console.log('getting restaurant')
	const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).send({ error: 'No restaurant found' });
    }

    const address = await Address.findOne({ userId: restaurant.ownerId });

    if (!address) {
      return res.status(404).send({ error: 'Address not found for restaurant' });
    }

    res.status(200).send(address);
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
};
