const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

//cloudinary uplode image
const cloudinaryuplodeimage = async (filetouplodimage) => {
  try {
    const data = await cloudinary.uploader.upload(filetouplodimage, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error)
    throw new Error("Internal Server 500 Error");

  }
};

//cloudinary remove image
const cloudinaryremoveimage = async (imagepublicid) => {
  try {
    const reuslte = await cloudinary.uploader.destroy(imagepublicid);
    return reuslte;
  } catch (error) {
    console.log(error)
    throw new Error("Internal Server 500 Error");

  }
};

//cloudinary remove Multipel image
const cloudinaryMultipelremoveimage = async (imagepublicids) => {
  try {
    const reuslte = await cloudinary.v2.api.delete_resources(imagepublicids);
    return reuslte;
  } catch (error) {
    console.log(error)
    throw new Error("Internal Server 500 Error");
  }
};

module.exports = {
  cloudinaryremoveimage,
  cloudinaryuplodeimage,
  cloudinaryMultipelremoveimage,
};
