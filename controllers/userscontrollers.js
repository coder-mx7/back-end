const asynchandler = require("express-async-handler")
const { User, valadtoinupdate } = require("../models/user")
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose")
const path = require("path")
const fs = require("fs")
const { cloudinaryremoveimage, cloudinaryuplodeimage } = require("../utils/cloudinary")
require('dotenv').config()

/**-----------------------------------*
 * @access private
 * @rout /api/USERs/profile
 * @description get all Users (only admin)
 * @method post
 -------------------------------------*/
module.exports.getallusers = asynchandler(async (req, res) => {

    const users = await User.find().select('-passwored')
    res.json(users)
})

/**-----------------------------------*
 * @access public
 * @rout /api/users/profile/:id
 * @description get Userni id (only person or admin)
 * @method get
 -------------------------------------*/

module.exports.getuserbyid = asynchandler(async (req, res) => {

    const user = await User.findById(req.params.id).select('-passwored')
    if (!user) {
        return res.status(404).json({ message: 'this Usernot found' })
    }
    res.json(user)
})


/**-----------------------------------*
 * @access private
 * @rout /api/users/profile/:id
 * @description update user by id (only authirzthions (peson verefiy token id and params id == true ) or  admin)
 * @method put
 -------------------------------------*/
module.exports.updateUser = asynchandler(async (req, res) => {
    const { error } = valadtoinupdate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    if (req.body.passwored) {
        const salt = await bcrypt.getSalt(10)
        req.body.passwored = await bcrypt.hash(req.body.passwored, salt)
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            passwored: req.body.passwored,
            bio: req.body.bio,
        }
    }, {
        new: true,
    }).select('-passwored')
    res.json(updateUser)
})

/**-----------------------------------*
 * @access private
 * @rout /api/USERs/count
 * @description get length User (only admin)
 * @method get
 -------------------------------------*/
module.exports.getlengthalluser = asynchandler(async (req, res) => {
    const users = await User.countDocuments()
    console.log(users)
    res.json(users)
})


/**-----------------------------------*
 * @access private
 * @rout /api/USERs/profile/uplod-photo-profil
 * @description guplod-photo-profil
 * @method post
 -------------------------------------*/


module.exports.uplodephotoprofil = asynchandler(async (req, res) => {

    //1.validate
    if (!req.file) {
        return res.status(400).json('photo not uplod')
    }

    //2.get the path to the image

    const imagepath = path.join(__dirname, `../images/${req.file.filename}`)


    //3.uplode to claundary

    const result = await cloudinaryuplodeimage(imagepath)
    console.log(result)
    //4.get the user from DB
    const user = await User.findById(req.user.id)

    //5.delete the old profile  photo if exist
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryremoveimage(user.profilePhoto.publicId)
    }

    //6. change the profile photo fild in the db 
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
    }
    await user.save();

    //SEND THE RESPONSE TO CLINT
    res.status(200).json({
        message: 'uplode photo profil susscflu',
        profilePhoto: {
            url: result.secure_url,
            publicId: result.public_id,
        },
        user:user
    })

    //remove images frome the server
    fs.unlinkSync(imagepath)
})

/**-----------------------------------*
 * @access private
 * @rout /api/USERs/profile/:id
 * @description delite user (account) by id 
 * @method delete
 -------------------------------------*/

module.exports.delituserprofile = asynchandler(async(req,res)=>{
    //1.get the user from db 

    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({message:"this user not found"})
    }

    //2.get all user from dB
    //3.get the public user ids from the posts
    //4.delet all post image from cloudinary thar belong this user
    //5.delet the profile picture from cloudinary 

    await cloudinaryremoveimage(user.profilePhoto.publicId)

    //6.delet user profile posts - comments
    //7.delete the user himeself
    await User.findByIdAndDelete(req.params.id)

    //send a response to the clint 
    res.json({message:"your profile has ben deleted "}) 

 })