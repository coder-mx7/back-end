const fs = require("fs")
const path = require("path")
const { cloudinaryremoveimage, cloudinaryuplodeimage, cloudinaryMultipelremoveimage } = require('../utils/cloudinary')
const asynchandler = require("express-async-handler")
const { valedatcrete, valedatupdate, Post } = require('../models/post')
const { Communt} = require("../models/Communts")

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
        post = await Post.find({ category })
            .sort({ createdAt: -1 })
            .populate("user", ["-passwored"])
            .populate("comments")

    } else if (pagenumber) {
        post = await Post.find()
            .skip((pagenumber - 1) * skipPage)
            .limit(skipPage)
            .sort({ createdAt: -1 })
            .populate("user"["-passwored"])
            .populate("comments")

    } else {
        post = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", ["-passwored"])
            .populate("comments")

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
    const post = await Post.findById(req.params.id).populate("user", ["-passwored"])
                           .populate("comments")
    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }

    res.json(post)
})

/**-----------------------------------*
 * @description get count posts
 * @rout /api/posts/count
 * @method get
 * @access public
 -------------------------------------*/

module.exports.getcountposts = asynchandler(async (req, res) => {
    const count = await Post.countDocuments()
    res.json(count)
})

/**-----------------------------------*
 * @description delete post
 * @rout /api/posts/:id
 * @method delete
 * @access private (only admin or him self)
 -------------------------------------*/

module.exports.deletedpost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }
    console.log(req.user, post.user)
    if (req.user.id === post.user.toString() || req.user.isAdmin) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryremoveimage(post.image.publicId)
        // delet all comunts
        await Communt.deleteMany({postid:req.params.id})
    }

    res.status(200).json({ message: "post has ben deleted successfully" })
})

/**-----------------------------------*
 * @description update post 
 * @rout /api/posts/:id
 * @method put
 * @access private (only him self or admin)
 -------------------------------------*/

module.exports.updatepostctrl = asynchandler(async (req, res) => {
    //1.valedation
    const { error } = valedatupdate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    //2.get the post from db an chek if post exist
    const post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }

    //chek if this post belong to logged in user 
    if (req.user.id !== post.user.toString()) {
        return res.status(403).json({ message: "access denied, you are not allowed" })
    }


    //update post
    const updateuser = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
        }
    }, { new: true }).populate("user", ["-passwored"])

    //send response to clint 
    res.status(200).json(updateuser)


})


/**-----------------------------------*
 * @description update image 
 * @rout /api/posts/uplod-image/:id
 * @method put
 * @access private (only him self or admin)
 -------------------------------------*/

module.exports.updatepostimagectrl = asynchandler(async (req, res) => {
    //1.valedation
    if (!req.file) {
        return res.status(400).json({ message: "no message provided" })
    }
    //2.get the post from db an chek if post exist
    const post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }

    //3.chek if this post belong to logged in user 
    if (req.user.id !== post.user.toString()) {
        return res.status(403).json({ message: "access denied, you are not allowed" })
    }


    //4.delete the old image 
    await cloudinaryremoveimage(post.image.publicId)

    //5.uplode new image 
    const imagepath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryuplodeimage(imagepath)
    console.log(result)

    //6.uplode the image filed in the db
    const updateimage = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }
        }
    }, { new: true }).populate("user", ["-passwored"])

    //7.sent the response to clint
    res.status(200).json(updateimage)
    //8.remove image from the server 
    fs.unlinkSync(imagepath)

})


/**-----------------------------------*
 * @description like post 
 * @rout /api/posts/like/:id
 * @method put
 * @access private (only user logged)
 -------------------------------------*/

module.exports.togglelikedpost = asynchandler(async (req, res) => {
    let post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(400).json({ message: "this post not found" })
    }
    const isuserliked = post.likes.find((user) => user.toString() === req.user.id)

    if (!isuserliked) {
        post = await Post.findByIdAndUpdate(req.params.id,
            {
                $push:{
                    likes:req.user.id
                }
            },{new:true}
        )
    }else{
        post = await Post.findByIdAndUpdate(req.params.id,
            {
                $pull:{
                    likes:req.user.id
                }
            },{new:true}
        )
    }
    res.status(200).json(post)

})