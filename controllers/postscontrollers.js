const fs = require("fs")
const path = require("path")
const { valedatcrete, valedatupdate, Post } = require('../models/post')
const { cloudinaryremoveimage, cloudinaryuplodeimage } = require('../utils/cloudinary')
const asynchandler = require("express-async-handler")
const { post } = require("../routes/postRoute")

/**-----------------------------------*
 * @description create new post 
 * @rout /api/posts
 * @method post
 * @access private (only loged in user)
 -------------------------------------*/


module.exports.createnewpost = asynchandler(async (req, res) => {
    // 1.validate image 
    if (!req.file) {
        return res.status(400).json({ message: "no image provided" })
    }
    // 2.validate for data 
    const { error } = valedatcrete(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // 3.upload photo 

    const imagepath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryuplodeimage(imagepath)

    // 4.create new post and save it to DB
    const post = await Post.create({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        user: req.user.id,
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        }
    })
    // 5.send the response to the client 
    res.status(201).json(post)
    // 6.remove image from the server 
    fs.unlinkSync(imagepath)
})

/**-----------------------------------*
 * @description get posts
 * @rout /api/posts
 * @method get
 * @access public
 -------------------------------------*/

module.exports.getposts = asynchandler(async (req, res) => {
    const skipPage = 3
    let post;
    const { category, pagenumber } = req.query
    if (category) {
        post = await Post.find({ category }).sort({ createdAt: -1 })
    } else if (pagenumber) {
        post = await Post.find()
            .skip((pagenumber - 1) * skipPage)
            .limit(skipPage)
            .sort({ createdAt: -1 })
    } else {
        post = await Post.find().sort({ createdAt: -1 })
    }
    res.json(post).status(200)

})

/**-----------------------------------*
 * @description get singel posts
 * @rout /api/posts/:id
 * @method get
 * @access public
 -------------------------------------*/

module.exports.singelpost = asynchandler(async (req, res) => {
    
})