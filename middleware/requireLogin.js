const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { JWT_TOKEN } = require('../config/key')
const User = mongoose.model('User');


module.exports = (request, response, next) => {
    const { authorization } = request.headers;
    if (!authorization)
    {
        return response.status(201).json({ error: 'you must be logged in' });

    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_TOKEN, (err, payload) => {
        if (err)
        {
            return response.status(201).json({error:'you must be logged in'})
        }
        const { _id } = payload
        User.findById(_id).then(userdata => {
            request.user = userdata
            next();
        })
        
    })
}