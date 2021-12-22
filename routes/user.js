const router = require('express').Router()
const bcrypt = require('bcrypt')
const UserSchema = require('../models/User')
const PostsSchema = require('../models/Posts')
const middleware = require('../middleware/middleware')

//Update User

router.put('/update/:id', middleware, (req, res) => {

    let { username, email, password } = req.body

        if(password !== ''){
            bcrypt.hash(password, 12).then(hashedPassword => {
                password = hashedPassword

                UserSchema.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: {username, email, password}
                    },
                    {
                        new: true
                    }
                ).then(updatedUser => {
                    const { password, ...rest } = updatedUser._doc
                    res.status(200).json({message: 'Profile updated successfully', user: rest})
                }).catch(err => {
                    res.status(422).json({error: 'User not found p', err})
                })
            })
        }
        else{
            UserSchema.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {username, email}
                },
                {
                    new: true
                }
            ).then(updatedUser => {
                const { password, ...rest } = updatedUser._doc
                res.status(200).json({message: 'Profile updated successfully', user: rest})
            }).catch(err => {
                res.status(422).json({error: 'User not found user1'})
            })
        }
})

//Delete User and its posts

router.delete('/delete/:id', middleware, (req, res) => {
    if(req.body._id === req.params.id){
        UserSchema.findById(req.params.id).then(userExist => {
            if(userExist){
                PostsSchema.deleteMany({postedBy: req.params.id}).then(deletedPosts => {
                    UserSchema.findByIdAndDelete(req.params.id).then(deletedUser => {
                        res.status(200).json({message: 'User and its posts deleted successfully'})
                    })
                })
            }
            else{
                res.status(422).json({error: 'User not found'})
            }
        }).catch(err => {
            res.status(422).json({error: 'User not found'})
        })
    }
    else{
        res.status(422).json({error: 'You are delete your own account only'})
    }
})

//Get single user

router.get('/:id', (req, res) => {
    UserSchema.findById(req.params.id).then(userFound => {
        if(userFound){
            const { password, ...rest } = userFound._doc
            res.status(200).json({message: 'User found successfully', user: rest})
        }
        else{
            res.status(422).json({error: 'User not found'})
        }
    }).catch(err => {
        res.status(422).json({error: 'User not found'})
    })
})

module.exports = router