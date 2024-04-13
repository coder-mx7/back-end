const asynchandler = require("express-async-handler")
const { valedatcreteCategory, Category } = require("../models/Category")


/**-----------------------------------*
 * @description create new category 
 * @rout /api/categorys
 * @method post
 * @access private (only admin)
 *  -------------------------------------*/

module.exports.categorysForHomePage = asynchandler(async(req,res)=>{
  const {error}= valedatcreteCategory(req.body)
  if(error){
      return res.status(404).json({message:error.details[0].message})
  }
  const category = await Category.create({
      titel:req.body.titel,
      user:req.user.id
  })
  res.status(201).json(category)
})