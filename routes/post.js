


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post =mongoose.model('Post')

router.get('/allpost',requireLogin, (request, response) => {
    Post.find()
        .populate("postedBy", '_id name pic')
        .populate("comments.postedBy",'_id name pic')
        .sort('-createdAt')
        .then(posts => {
        response.json({posts})
        })
        .catch(err => {
        console.log(err)
    })
})

router.get('/getsubscribe',requireLogin, (request, response) => {
    Post.find({ postedBy: { $in: request.user.following } })
        .populate("postedBy", '_id name pic')
        .populate("comments.postedBy",'_id name pic')
        .select('-password')
        .sort('-createdAt')
        .then(posts => {
        response.json({posts})
        })
        .catch(err => {
        console.log(err)
    })
})


router.post('/createpost',requireLogin, (request, response) => {
    const { title, describe,pic } = request.body;
    if (!pic) {
        return response.status(201).json({error:'please fill all required fields'})
    }
    request.user.password = undefined;
    const post = new Post({
        title,
        describe,
        pic,
        postedBy:request.user
    })
    post.save()
        .then(result => {
        response.json({post:result})
        })
        .catch(err => {
            console.log(err);
    })
})

router.get('/mypost', requireLogin, (request, response) => {
    Post.find({ postedBy: request.user._id })
        .select("-password")
        .populate('postedBy', '_id name')
        .then(mine => {
            response.json({ mine})
        })
        .catch(err => {
        console.log(err)
    })
})

router.put('/like', requireLogin, (request, response) => {
    Post.findByIdAndUpdate(request.body.postId, {
        $push: { likes: request.user._id }
    }, {
        new: true,
    }).exec((err, result)=> {
        if (err)
        {
            response.status(201).json({error:err})
        }
        else
        {
            response.json({result})
        }
    })

})


router.put('/unlike', requireLogin, (request, response) => {
Post.findByIdAndUpdate(request.body.postId, {
$pull: { likes: request.user._id }
}
, {
new:true
}).exec((err, result) => {
if (err)
{
    response.status(201).json({ error: err });
}
else {
    response.json({result})
}
})
})


router.put('/comment', requireLogin, (request, response) => {
    const comment = {
        text:request.body.text,
        postedBy:request.user._id
    }
    Post.findByIdAndUpdate(request.body.postId, {
        $push: { comments: comment }
        
    },
        {
        new:true,
        }).populate("comments.postedBy", "_id name pic")
        .populate("postedBy","_id name pic ")
        .exec((err, result) => {
            if (err)
            {
                response.status(201).json({ error: err });
            }
            else
            {
                response.json({result});
            }
    })
})


router.delete('/deletepost/:postId', requireLogin, (request, response) => {
    Post.findOne({ _id: request.params.postId })
        .populate('postedBy', '_id')
        .exec((err, post) => {
        if(err || !post)
        {
           return response.status(201).json({error:err})
            }
            if (post.postedBy._id.toString() === request.user._id.toString()) {
                post.remove()
                    .then(result => {
                        response.json({ result })
                    })
                    .catch(err => {
                        console.log(err);
                })
            }
        })
        
})

    

module.exports = router;