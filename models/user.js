
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

  

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,

    },

    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,

    },
    about: {
        type: String,
        required:true,
    },
    pic: {
        type: String,
        required:true,
    },
    followers: [{
        type: ObjectId, ref: "User"
    }],
    following: [{
        type: ObjectId, ref: "User"
    }]

    
})



mongoose.model('User', userSchema)