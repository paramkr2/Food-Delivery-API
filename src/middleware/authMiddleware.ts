import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized Access' });
        }

        const payload = await jwt.verify(token, process.env.secretkey);
        res.locals.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid Token' });
    }
};

export default authMiddleware;
