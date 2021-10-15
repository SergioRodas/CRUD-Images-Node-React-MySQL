const express = require('express')

const routes = require('./routes/routes')

const app = express()

app.use(routes)

app.listen(9000, () => {
    console.log('server running', 'http://localhost:' + 9000)
})