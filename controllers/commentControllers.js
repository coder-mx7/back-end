const asynchandler = require("express-async-handler")
const { Communt, valedatcretecommunt, valedatupdatecommunt } = require("../models/Communts")
const { User } = require("../models/USER")


/**-----------------------------------*
 * @description create new commuent 
 * @rout /api/communts
 * @method post
 * @access private (only loged in user)
 -------------------------------------*/
module.exports.createnewcommunte = asynchandler(async (req, res) => {
    const { error } = valedatcretecommunt(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const profile = await User.findById(req.user.id)
    const communt = await Communt.create({
        text: req.body.text,
        postid: req.body.postid,
        username: profile.username,
        user: req.user.id,
    })

    res.status(201).json(communt)

})

/**-----------------------------------*
 * @description create new commuent 
 * @rout /api/communts
 * @method get
 * @access private (only admin)
 -------------------------------------*/
module.exports.getallcommunt = asynchandler(async (req, res) => {
    const communt = await Communt.find().populate("user", ["-passwored"])
    console.log(communt)
    if (communt) {
        res.status(200).json(communt)
    }
})

/**-----------------------------------*
 * @description delete commuent 
 * @rout /api/communts/:id
 * @method delete
 * @access private (only admin or him self)
 -------------------------------------*/

module.exports.deleteCommunte = asynchandler(async (req, res) => {
    let communt = await Communt.findById(req.params.id)
    if (!communt) {
        return res.status(404).json({ message: "this communt not found" })
    }
    if (req.user.isAdmin || req.user.id === communt.user.toString()) {
        communt = await Communt.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "communt has been delete" })
    }

    return res.status(400).json({ message: "access denied, not allowed" })

})

/**-----------------------------------*
 * @description update commuent 
 * @rout /api/communts/:id
 * @method put
 * @access private (only admin or him self)
 -------------------------------------*/

 module.exports.updateCommunte = asynchandler(async (req, res) => {

    const {error} = valedatupdatecommunt(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    let communt = await Communt.findById(req.params.id)
    if (!communt) {
        return res.status(404).json({ message: "this communt not found" })
    }

    if (req.user.isAdmin || req.user.id === communt.user.toString()) {
        communt = await Communt.findByIdAndUpdate(req.params.id,{
            $set:{
                text:req.body.text
            }
        },{
            new:true
        })
        return res.status(200).json(communt)
    }

    return res.status(403).json({ message: "access denied, only user him sel or admin not allowed" })

})