const router = require('express').Router()
const bcrypt = require('bcrypt')
const UserSchema = require('../models/User')
const cartoonAvatar = require('cartoon-avatar')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'arslanarjumand012@gmail.com',
      pass: 'ArslanArjumand123@',
    },
  });

//Create User

router.post('/register', (req, res) => {
    
    const { username, email, password, gender } = req.body

    if(!username || !email || !password || !gender ){
        return res.status(422).json({error: 'Please fill all the fields'})
    }
    else{
        UserSchema.findOne({email}).then(emailExist => {
            if(emailExist){
                return res.status(422).json({error: 'Please try a different email'})
            }
            else{
                UserSchema.findOne({username}).then(usernameExist => {
                    if(usernameExist){
                        return res.status(422).json({error: 'Please try a different username'})
                    }
                    else{
                        bcrypt.hash(password, 12).then(hashedPassword => {
                            
                            const avatarGenerate = cartoonAvatar.generate_avatar({'gender': gender})

                            const user = new UserSchema({
                                username,
                                email,
                                password: hashedPassword,
                                gender,
                                avatar: avatarGenerate
                            })
                            user.save().then(savedUser => {
                                transporter.sendMail({
                                    from: 'arslanarjumand012@gmail.com',
                                    to: savedUser.email,
                                    subject: 'Welcome to Blog App',
                                    text: 'Hello from Arslan',
                                    html: '<b>Hello from Arslan</b>'
                                }).then(mailSend => {
                                    const { password, ...rest } = savedUser._doc
                                    res.status(200).json({message: 'User is registered successfully', user: rest})
                                })
                                .catch(err => {
                                    return res.status(422).json({error: 'Something wrong, Try again'})
                                })
                            })
                        })
                    }
                })
            }
        })
    }
})

//Login User

router.post('/login', (req, res) => {
    const { username, password } = req.body

    if(!username || !password){
        res.status(422).json({error: 'Please fill all the fields'})
    }
    else{
        UserSchema.findOne({username}).then(usernameExist => {
            if(!usernameExist){
                res.status(422).json({error: 'Invalid credentials'})
            }
            else{
                bcrypt.compare(password, usernameExist.password).then(matchedPassword => {
                    if(matchedPassword){
                        const token = jwt.sign({id: usernameExist._id}, process.env.KEY)                       
                        const { password, ...rest } = usernameExist._doc
                        res.status(200).json({message: "You are successfully login", token, user: rest})
                    }
                    else{
                        res.status(422).json({error: 'Invalid credentials'})
                    }
                })
            }
        })
    }
})

module.exports = router