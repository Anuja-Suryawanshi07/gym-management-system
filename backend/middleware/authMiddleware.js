const jwt = require('jsonwebtoken');

//Middleware to verify JWT and attach user info to req
exports.authenticate = (req, res, next) => {
    //1.Get token from header (usually format: "Bearer TOKEN")
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required. Token missing or malformed.' });
    }
    const token = authHeader.split( ' ') [1];

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //3. Attach user info (id, email, role) to the request object
        req.user = decoded;

        //4. Proceed to the next middleware or route handler
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