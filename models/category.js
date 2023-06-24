const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    icon: {
        type: String,
    },
    color: {
        type: String
    },
    image: {
        type: String
    }
})

exports.Category = mongoose.model('Category',categorySchema)