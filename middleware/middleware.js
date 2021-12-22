const jwt = require('jsonwebtoken')
const UserSchema = require('../models/User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization){
        res.status(401).json({error: 'You must be logged in'})
    }
    else{
        const token = authorization.replace("Bearer ", "")
        jwt.verify(token, process.env.KEY, (err, payload) => {
            if(err){
                res.status(401).json({error: 'You must be logged in '})
            }
            else{
                const { id } = payload
                UserSchema.findById(id).then(userData => {
                    req.user = userData
                    next();
                })
            }
        })
    }
}