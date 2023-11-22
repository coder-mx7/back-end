const mongoose = require('mongoose')
require('dotenv').config()

function concatetodb() {
    try {
        mongoose.connect(process.env.URL_MONGODB)
        console.log('connect to dataBase true (^_^)')
    } catch (error) {
        console.log(`faild connect to dataBase error(-_-):${error}`)
    }
}

module.exports = concatetodb