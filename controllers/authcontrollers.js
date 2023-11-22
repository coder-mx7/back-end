const asynchandler = require("express-async-handler")
const { User, valadtoinrejsterd, valadtoinlogin } = require("../models/user")
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose")


/**-----------------------------------*
 * @access public
 * @rout /auth/api/rejsterd
 * @description create a new user (rejster)
 * @method post
 -------------------------------------*/





module.exports.regsterd = asynchandler(async (req, res) => {

    //validation
    const { error } = valadtoinrejsterd(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //is user already exists

    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ message: 'this email is already exists' })
    }

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashPasswored = await bcrypt.hash(req.body.passwored, salt)
    //new user and save it to db


    user = new User({
        username: req.body.username,
        email: req.body.email,
        passwored: hashPasswored,
    })

    await user.save()

    //send a response to client
    res.status(201).json({ message: 'rejsterd is susscfuly' })

})

/**-----------------------------------*
 * @access public
 * @rout /auth/api/login
 * @description login
 * @method post
 -------------------------------------*/

module.exports.login = asynchandler(async (req, res) => {
    
    const { error } = valadtoinlogin(req.body)
    if(error){
        return res.status(400).json({ message: error.details[0].message })
    }
    const user = await User.findOne({ email: req.body.email });
    console.log(user)

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const passwordmatch = await bcrypt.compare(req.body.passwored, user.passwored);

    if(!passwordmatch){
        return res.status(404).json('this password or emali not found')
    }

    const token = user.generateAuthToken()

    res.status(200).json({
        _id:user._id,
        isAdmin:user.isAdmin,
        email:user.email,
        photoprofile:user.photoprofile,
        token,
    })


})