const mongoose = require('mongoose')
const joi = require("joi")
const jwt = require('jsonwebtoken')


const PostScam = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    description: {
        type: String,
        trim: true,
        minlength: 2,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null,
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


// Populate posts that belongs to this user when he/she get his/her profile 

PostScam.virtual('comments', {
    ref: 'comment',
    foreignField: 'postid',
    localField: '_id',
});


//model post 
const Post = mongoose.model('post', PostScam)





//validait create post 

function valedatcrete(obj) {
    const Schema = joi.object({
        title: joi.string().trim().min(2).max(100).required(),
        description: joi.string().trim().min(2).required(),
        category: joi.string().trim().required(),
    })
    return Schema.validate(obj)
}
//validait update post 

function valedatupdate(obj) {
    const Schema = joi.object({
        title: joi.string().trim().min(2).max(100),
        description: joi.string().trim().min(2),
        category: joi.string().trim(),
    })
    return Schema.validate(obj)
}

module.exports = {
    valedatcrete,
    valedatupdate,
    Post,
}