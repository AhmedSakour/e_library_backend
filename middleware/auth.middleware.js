const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();  
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (req.user && Number(req.user.isAdmin) === 1) {
        return next();
    }
    return res.status(403).json({ message: 'Access forbidden. This action is allowed for admins only.' });
};
