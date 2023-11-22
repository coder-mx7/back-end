const cloudinary = require('cloudinary')
require('dotenv').config()

cloudinary.config({
    cloudinary_url:process.env.CLOUDINARY_URL,

})


//cloudinary uplode image 
const cloudinaryuplodeimage = async (filetouplodimage)=>{
    try {
        const data = await cloudinary.uploader.upload(filetouplodimage,{
            resource_type:'auto',
        })
        return data

    } catch (error) {
        return error
    }
}

//cloudinary remove image 
const cloudinaryremoveimage = async (imagepublicid)=>{
    try {
        const reuslte = await cloudinary.uploader.destroy(imagepublicid)
        return reuslte 

    } catch (error) {
        return error
    }
}

module.exports = {
    cloudinaryremoveimage,
    cloudinaryuplodeimage,
}