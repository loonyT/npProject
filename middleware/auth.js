const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //get token from the header

    const token = req.header('x-auth-token'); //header key to where we wanna send the token

    //check if not token 

    if (!token) { //return a response with the status not authorized
        return res.status(401).json({
            msg: 'no token, authorization denied'
        });

    }

    //verify token

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); //this will decode the token

        //take request object and assign a value to user

        req.user = decoded.user;
        next(); //like in any middleware




    } catch (err) {
        res.status(401).json({
            msg: 'token is not valid'
        });
    }

};