const asynchandler = require("express-async-handler")
const { valedatcreteCategory, Category } = require("../models/Category")


/**-----------------------------------*
 * @description create new category 
 * @rout /api/categorys
 * @method post
 * @access private (only admin)
 *  -------------------------------------*/
module.exports.createNewcategory = asynchandler(async(req,res)=>{
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

/**-----------------------------------*
 * @description get all category 
 * @rout /api/categorys
 * @method get
 * @access public 
 *  -------------------------------------*/
module.exports.getallcategorys = asynchandler(async(req,res)=>{

    const category = await Category.find()

    res.status(201).json(category)
})

/**-----------------------------------*
 * @description delete category by id
 * @rout /api/categorys/:id
 * @method delete
 * @access private 
 *  -------------------------------------*/
module.exports.deletebyidcategorys = asynchandler(async(req,res)=>{


    let category = await Category.findById(req.params.id)
    if(!category){
        return res.status(404).json("this category not found")
    }
    category = await Category.findByIdAndDelete(req.params.id)

    res.status(201).json("this category delete")
})

/**-----------------------------------*
 * @description update category by id
 * @rout /api/categorys/:id
 * @method put
 * @access private 
 *  -------------------------------------*/
module.exports.updatebyidcategorys = asynchandler(async(req,res)=>{

    let category = await Category.findById(req.params.id)
    if(!category){
        return res.status(404).json("this category not found")
    }
    category = await Category.findByIdAndUpdate(req.params.id,{
        $set:{
            titel:req.body.titel,
        }
    },{
        new:true,
    })

    res.status(201).json(category)
})

/**-----------------------------------*
 * @description get category by category
 * @rout /api/categorys/category
 * @method get
 * @access public 
 *  -------------------------------------*/

module.exports.getcategorysbycategory = asynchandler(async(req,res)=>{
  // استخراج نوع الفئة المطلوبة من الطلب، يفترض هنا أنه يأتي كمعلمة query في طلب HTTP
  const type = req.params.category;

  // التحقق مما إذا كان تم توفير نوع الفئة في الطلب
  if (!type) {
      return res.status(400).json({ success: false, message: "نوع الفئة مطلوب" });
  }

  // البحث عن الفئات بناءً على نوع الفئة المحدد
  const categories = await Category.find({ titel: type });

  // التحقق مما إذا كانت هناك فئات متاحة
  if (!categories || categories.length === 0) {
      return res.status(404).json({ success: false, message: "لا يوجد فئات متاحة لهذا النوع" });
  }

  // إرسال الفئات كاستجابة
  res.status(200).json({ success: true, data: categories });
});