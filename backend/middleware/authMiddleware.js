const jwt = require('jsonwebtoken');

//Middleware to verify JWT and attach user info to req
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // 1. Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required. Token missing or malformed.' });
    }
    // 2. Extract the token
    const token = authHeader.split( ' ') [1];

    // Check if the token part exists after splitting
    if (!token) {
        return res.status(401).json({ message: 'Authentication required. Token missing.' });
    }
    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //4. Attach user info (id, email, role) to the request object
        req.user = decoded;

        //5. Proceed to the next middleware or route handler
        next(); 
    } catch (error) { 
        console.error("JWT Verification failed:", error);
        return res.status(403).json({ message: 'Access denied. Invalid or expired token.' });
    }
};

// Middleware to check if the user is an Admin
exports.isAdmin = (req, res, next) => {
    // This assumes the authenticate middleware has already run and attched req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
};
// Middleware to check if the user is an Trainer
exports.isTrainer = (req, res, next) => {
    if (req.user && req.user.role === 'trainer') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden. Trainer access required.'});
    }
};

// Middleware to check if the user is an Member
exports.isMember = (req, res, next) => {
    if (req.user && req.user.role === 'member') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden. Member access required.'});
    }
};
