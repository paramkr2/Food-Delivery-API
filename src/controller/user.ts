import Address from '../models/address'
import User from '../models/user' 

const addressUpdate = async (req, res) => {
    try {
        const { userId } = res.locals;
        const fields = req.body;

        // Assuming 'Address' is a Mongoose model
        let address = await Address.findOne({ userId });

        if (!address) {
            // If address doesn't exist, create a new one
            address = await Address.create({ ...fields, userId });
        } else {
            // If address exists, update it
            address = await Address.findOneAndUpdate({ userId }, { $set: fields }, { new: true });
        }

        return res.status(200).send(address);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

const getUser = async (req, res) => {
    try {
        const { userId } = res.locals;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ msg: 'User not found' });
        }
        return res.status(200).send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: 'Internal Server Error', err });
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = res.locals;
        const {  email } = req.body;

        // Example: Assuming 'User' is a Mongoose model
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ msg: 'User not found' });
        }

        // Update user fields other than address
       
        user.email = email;
        await user.save();

        return res.status(200).send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: 'Internal Server Error', err });
    }
}


 const getAddress = async (req, res) => {
  try {
    const {userId} = res.locals;
    const address = await Address.findOne({ userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export {addressUpdate,getUser,updateUser,getAddress};