const express = require('express')
const app = express();
const port = 3000;

app.get('/api/v1/authentication', (req, res) => {
    res.json({
        msg: "authentication"
    })
})

app.listen(port, () => console.log(`[authentication] listening on port ${port}`))
