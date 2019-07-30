const jwt = require('jsonwebtoken');
const config = require('config');

//middleware function has access to req and res objects, with next as a call back that lets it move on to next middleware
module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');

    // check if no token present
    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied'
        })
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // take req object and assign value to user, set to decoded which has user in the payload
        req.user = decoded.user;
        next();
        //if there is token that is not valid we get catch function  
    } catch (err) {
        res.status(401).json({
            msg: 'Token is not Valid'
        })
    }
}