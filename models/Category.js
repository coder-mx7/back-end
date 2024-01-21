const mongoose = require("mongoose")
const joi = require("joi")

const CategoryScema = new mongoose.Schema({
    titel: {
        type: String,
        required: true,
        trim:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

}, {
    timestamps: true,
})

const Category = mongoose.model("Category", CategoryScema)

//validait create Category 

function valedatcreteCategory(obj) {
    const Schema = joi.object({
        titel: joi.string().label("titel").required(),
    })
    return Schema.validate(obj)
}



module.exports = {
    Category,
    valedatcreteCategory,
}