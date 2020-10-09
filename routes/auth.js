
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { JWT_TOKEN } = require('../config/key');


router.post('/signup', (request, response) => {
    const { name, email, password ,pic,about} = request.body;
    if (!name || !email || !password ||!pic||!about)
    {
       return response.status(201).json({ error: 'please fill all required fields' }) 
        
    }
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
        return response.status(201).json({error:'Invalid Email'})
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser)
            {
                return response.status(201).json({error:'User already  exists with this email'})
            }

            bcrypt.hash(password,12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        name,
                        about,
                        pic,
                        password:hashedpassword,
                    })
                    user.save()
                        .then(user => {
                            const { _id, name, email, pic,about } = user;
                            response.json({ user: { _id, name, email, pic,about } });
                            response.json({ message: 'Saved successfully' });
                            
                            
                        })
                        .catch(err => {
                           console.log(err)
                           })
                    
            })
            
        })
        .catch(err => {
        console.log(err)
    })
    
});


router.post('/signin', (request, response) => {
    const { email, password } = request.body;
    if (!email || !password)
    {
       return response.status(201).json({error:'Please fill all required fileds'})
    }
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
        return response.status(201).json({error:'Invalid Email'})
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser)
            {
                return response.status(201).json({error:'email or password is invalid'})  
                
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch)
                    {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_TOKEN);
                        const {_id,name,email,pic,about,followers,following}=savedUser
                        response.json({ token, user: { _id, name, email,pic,about,followers,following} })
                    }
                    else
                    {
                        return response.status(201).json({error:'email or password is  invalid'})
                    }
                })
                .catch(err => {
                    console.log(err);
            })
    })
    
})


module.exports = router