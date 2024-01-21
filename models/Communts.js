const mongoose = require("mongoose")
const joi = require("joi")

const communtScema = new mongoose.Schema({
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "post",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
        max: 8000,
    },
    username: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

const Communt = mongoose.model("comment", communtScema)

//validait create communt 

function valedatcretecommunt(obj) {
    const Schema = joi.object({
        text: joi.string().max(8000).required(),
        postid: joi.string().required(),
    })
    return Schema.validate(obj)
}

//validait update communt 

function valedatupdatecommunt(obj) {
    const Schema = joi.object({
        text: joi.string().max(8000).required(),
    })
    return Schema.validate(obj)
}

module.exports = {
    Communt,
    valedatcretecommunt,
    valedatupdatecommunt,
}