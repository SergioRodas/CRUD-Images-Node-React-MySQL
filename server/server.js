const express = require('express')
const mysql = require('mysql')
const myConnectionDB = require('express-myconnection')
const routes = require('./routes/routes')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(myConnectionDB(mysql, {
    host: 'localhost',
    port:3306,
    user: 'root',
    password:'123456789',
    database: 'images'
}))

app.use(cors())

// define the dbimages folder as a static directory
app.use(express.static(path.join(__dirname, 'dbimages')))

app.use(routes)

app.listen(9000, () => {
    console.log('server running', 'http://localhost:' + 9000)
})