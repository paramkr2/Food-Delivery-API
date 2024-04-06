import Driver from'../models/driver'

export const getLocation = async( req,res) => {
	try{
		const driverId = req.params.driverId
		const driver = await Driver.findById(driverId)
		if( !driver ){ 
			console.log( 'no driver found ')
			return res.status(404).send('No driver with provide driverId ') 
		}
		return res.status(200).send(driver.location);
	
	}catch(err){
		console.log(err)
		return res.status(500).send('Internal Server Error')
	}
	
}