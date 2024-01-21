const mongoose = require('mongoose')
const joi = require("joi")
const jwt = require('jsonwebtoken')


const UserScam = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    passwored: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            publicId: null,
        }
    },
    bio: String,
    isAdmin: {
        type: Boolean,
        default: false,

    },
    isacountverfieD: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

// Populate posts that belongs to this user when he/she get his/her profile 

UserScam.virtual('posts', {
    ref: 'post',
    localField: '_id',
    foreignField: 'user',
});



//genrate token USER

UserScam.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.secret_key)
}

//USERmodel 
const User = mongoose.model("User", UserScam)
//valadtoin resterd 

function valadtoinrejsterd(opj) {
    const Schema = joi.object({
        username: joi.string().min(2).max(100).trim().required(),
        passwored: joi.string().min(8).required(),
        email: joi.string().min(5).max(100).trim().required(),
    })
    return Schema.validate(opj)
}

//valadtoin login 

function valadtoinlogin(opj) {
    const Schema = joi.object({
        passwored: joi.string().min(8).required(),
        email: joi.string().min(5).max(100).trim().required(),
    })
    return Schema.validate(opj)
}


//valadtoin update   
function valadtoinupdate(opj) {
    const Schema = joi.object({
        passwored: joi.string().min(8),
        username: joi.string().min(5).max(100).trim(),
        bio: joi.string().min(5).max(100).trim(),
    })
    return Schema.validate(opj)
}

module.exports = {
    User,
    valadtoinrejsterd,
    valadtoinlogin,
    valadtoinupdate,
}








