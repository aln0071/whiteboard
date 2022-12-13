const express = require('express')
const app = express();
const port = 3000;

const users = []

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "some secret";

app.use(express.json())

app.get('/api/v1/authentication', (req, res) => {
    res.json({
        msg: "authentication"
    })
})

app.post('/api/v1/authentication/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword})
    res.status(201).send(users);
})

app.post('/api/v1/authentication/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    console.log(user)
    if(user === undefined) {
        return res.status(404).send("User does not exist!");
    }
    if(await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken(user);
        res.json({
            accessToken
        })
    } else {
        res.status(401).send("Password Incorrect!");
    }
})

function generateAccessToken(user) {
    return jwt.sign(user, secret, {expiresIn: "15m"})
}

app.listen(port, () => console.log(`[authentication] listening on port ${port}`))
