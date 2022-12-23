const express = require('express')
const app = express();
const port = 3000;

const { DB_URI } = require('./config');

const mongoose = require('mongoose')
mongoose.connect(DB_URI);

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "some secret";

const { UserSchema } = require('app-models')

const UserModel = mongoose.model('User', UserSchema)

app.use(express.json())

app.get('/api/v1/authentication', (req, res) => {
    res.json({
        msg: "authentication"
    })
})

app.post('/api/v1/authentication/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserModel.findOne({username})
        if(existingUser !== null) {
            res.status(400).json({
                error: "Username in use"
            })
            return next();
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel();
        user.username = username;
        user.password = hashedPassword;
        await user.save();
        res.status(201).send({
            msg: 'User registered!'
        });
    } catch (error) {
        next(error);
    }
})

app.post('/api/v1/authentication/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username })
        if (user === null) {
            res.status(404).json({
                error: "User does not exist!"
            });
            return next();
        }
        if (await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken({
                _id: user._id,
                username: user.username
            });
            res.json({
                accessToken
            })
        } else {
            res.status(401).json({
                error: "Password Incorrect!"
            });
        }
        next();
    } catch (error) {
        next(error)
    }
})

function generateAccessToken(user) {
    return jwt.sign(user, secret, { expiresIn: "15m" })
}

app.use((err, req, res, next) => {
    res.status(500);
    console.log(err)
    res.json({ error: err.message })
})

app.listen(port, () => console.log(`[authentication] listening on port ${port}`))
