const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const userRoute = require('./routes/user')

dotenv.config({path: './config/config.env'});

const app = express()

app.use(express.json())

connectDB()

app.use('/auth/', authRoute)

app.use('/post/', postsRoute)

app.use('/user/', userRoute)

// To deploy on Heroku

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
}

const port = process.env.PORT || 7000

app.listen(port, () => {
    console.log(`Server is Running at port ${port}`)
})