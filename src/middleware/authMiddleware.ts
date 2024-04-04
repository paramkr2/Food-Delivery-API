import jwt , {JwtPayload} from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized Access' });
        }

        const payload = await jwt.verify(token, process.env.secretkey);
		console.log('authmiddlware',payload)
        res.locals.userId = payload.userId;
		res.locals.restaurantOwner = payload.restaurantOwner;

        next();
    } catch (error) {
		console.log(error);
         res.status(400).json({ error: 'Invalid Token' });
    }
};

export default authMiddleware;
