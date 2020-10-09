
const { response, request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const User = mongoose.model('User');
const Post = mongoose.model('Post');


router.get('/user/:id', requireLogin, (request, response) => {
    User.findOne({ _id: request.params.id })
        .then(user => {
            Post.find({ postedBy: request.params.id })
                .populate('postedBy', '_id name')
                .exec((err, posts) => {
                    if (err) {
                       return response.status(201).json({ error: err });
                    }
                    response.json({user,posts})
            })
        }).catch(err => {
            response.status(201).json({ error: err });
        })
        
    
})



router.put('/follow', requireLogin, (request, response) => {
    User.findByIdAndUpdate(request.body.followId, {
        $push: { followers: request.user._id }
    }, { new: true }, (err, result) => {
        if (err)
        {
           return response.status(201).json({ error: err });
        }
            User.findByIdAndUpdate(request.user._id, {
                $push: { following: request.body.followId }
            },
            {
                new:true
                }).select("-password")
                .then(result => {
                response.json(result)
            }).catch(err => {
               return response.status(201).json({ error: err });
            })
            
        }
        )
    
    
})



router.put('/unfollow', requireLogin, (request, response) => {
    User.findByIdAndUpdate(request.body.unfollowId, {
        $pull: { followers: request.user._id }
    }, { new: true }, (err, result) => {
        if (err)
        {
           return response.status(201).json({ error: err });
        }
            User.findByIdAndUpdate(request.user._id, {
                $pull: { following: request.body.unfollowId }
            },
            {
                new:true
                })
                .select('-password')
                .then(result => {
                response.json(result)
            }).catch(err => {
                response.status(201).json({ error: err });
            })
            
        }
        )
    
    
})

router.put('/updatepic', requireLogin, (request, response) => {
    User.findByIdAndUpdate(request.user._id, { $set: { pic: request.body.pic } }, {
        new: true,
    },
        (err, result) => {
            if (err) {
            return response.status(201).json({error:err})
            }
            response.json(result)
    })
})
router.put('/updateprofile', requireLogin, (request, response) => {
    User.findByIdAndUpdate(request.user._id, { $set: { name: request.body.name,email:request.body.email,about:request.body.about } }, {
        new: true,
    },
        (err, result) => {
            if (err) {
            return response.status(201).json({error:err})
            }
            response.json(result)
    })
})


    
router.post('/searchUser', requireLogin, (request, response) => {
    let userpattern = new RegExp("^" + request.body.query,"i");
    User.find({ name: { $regex: userpattern } })
    .select('_id name pic')
        .then(user => {
            response.json(user);
        })
        .catch(err => {
            console.log(err);
    })
})



module.exports = router;