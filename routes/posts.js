const router = require('express').Router()
const UserSchema = require('../models/User')
const PostsSchema = require('../models/Posts')
const middleware = require('../middleware/middleware')

//Create Post

router.post('/create', middleware, (req, res) => {
    const { title, body, pic } = req.body

    if(!title || !body || !pic){
        res.status(422).json({error: 'Please fill all the fields'})
    }
    else{
        const post = new PostsSchema({
            title,
            body,
            pic,
            postedBy: req.user
        })
        
        post.save().then(savedPost => {
            res.status(200).json({message: 'Post created successfully', post: savedPost})
        })
    }
})

//Update Post

router.put('/update/:id', middleware, (req, res) => {
        PostsSchema.findById(req.params.id).then(postExist => {
            if(postExist){
                PostsSchema.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body
                    },
                    {
                        new: true
                    }
                ).then(updatedPost => {
                    res.status(200).json({message: 'Post updated successfully', updatedPost: updatedPost})
                })
            }
            else{
                res.status(422).json({error: 'You can update only your own posts'})
            }
        }).catch(err => {
            res.status(422).json({error: 'Something Wrong'})
        })
})

//Delete Post

router.delete('/delete/:id', middleware, (req, res) => {
    if(req.body._id === req.params.id){
        PostsSchema.findById(req.params.id).then(postExist => {
            if(postExist){
                postExist.delete()
                res.status(200).json({message: 'Post deleted successfully'})
            }
            else{
                res.status(422).json({error: 'You can delete only your own posts'})
            }
        }).catch(err => {
            res.status(422).json({error: 'Something Wrong'})
        })
    }
    else{
        res.status(422).json({error: 'You can delete only your own posts'})
    }
})

//Get Single Post

router.get('/:id', (req, res) => {
    PostsSchema.findById(req.params.id).populate("postedBy","_id username").then(postExist => {
        if(postExist){
            console.log(postExist);
            res.status(200).json({message: 'Post found', post: postExist})
        }
        else{
            res.status(422).json({error: 'Post does not exist'})
        }
    }).catch(err => {
        res.status(422).json({error: 'Post does not exist'})
    })
})

//Get All Posts

router.get('/', (req, res) => {
    PostsSchema.find({}).then(allPosts => {
        if(allPosts.length > 0){
            res.status(200).json({message: 'All Posts', posts: allPosts})
        }
        else{
            res.status(422).json({error: 'There are no posts for the moment'})
        }
    }).catch(err => {
        res.status(422).json({error: 'There are no posts for the moment'})
    })
})

module.exports = router