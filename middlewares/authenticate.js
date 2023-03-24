const jwt = require("jsonwebtoken");

const {User} = require("../models/user");

const {HttpError} = require("../helpers");
require('dotenv').config();

const {SECRET_KEY} = process.env;


const authenticate = async (req, res, next) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");
    if(bearer !== `Bearer`) {
        console.log(JSON.stringify(req.headers));
        next(HttpError(401, "here1"));
        
    }
    try {
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if(!user || !user.token || user.token !== token) {
            next(HttpError(401, "here2")); 
        }
        req.user = user;
        next();
    }
    catch(error){
        next(HttpError(401, "here3"));
        console.error(JSON.stringify(next(error)))
    }
}

module.exports = authenticate;