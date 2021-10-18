const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const diskStorage = multer.diskStorage({
    // If it does not exist, create the images folder in the main directory of the project
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
       cb(null, Date.now() + '-' + file.originalname) 
    }
})

const fileUpload = multer({
    storage: diskStorage
})

router.get('/', (req, res) => {
    res.send('Welcome to my image app')
})

router.post('/images/post', fileUpload.single('image'), (req, res) => {

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('server error')

        const type = req.file.mimetype
        const name = req.file.originalname
        const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))

        conn.query('INSERT INTO image set ?', [{type, name, data}], (err, rows) => {
            if (err) return res.status(500).send('server error')
            // Once the image is saved, delete it from the 'images' directory
            fs.unlinkSync(path.join(__dirname, '../images/' + req.file.filename))
            res.send('image saved!')
        })
    })
})

router.get('/images/get', (req, res) => {

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('server error')

        conn.query('SELECT * FROM image', (err, rows) => {
            if (err) return res.status(500).send('server error')
            rows.map(img => {
                // Loop through the rows of the image table and save each image in the dbimages folder using its 'data' property
                fs.writeFileSync(path.join(__dirname, '../dbimages/' + img.id + '.png'), img.data)
            })

            const imageDir = fs.readdirSync(path.join(__dirname, '../dbimages/'))

            res.json(imageDir)
        })
    })
})

router.delete('/images/delete/:id', (req, res) => {

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('server error')

        conn.query('DELETE FROM image WHERE id = ?', [req.params.id], (err, rows) => {
            if (err) return res.status(500).send('server error')

            fs.unlinkSync(path.join(__dirname, '../dbimages/' + req.params.id + '.png'))

            res.json('image deleted')
        })
    })
})

module.exports = router