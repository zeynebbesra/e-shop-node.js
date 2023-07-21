const { Category } = require('../models/category')
const {Product} = require('../models/product')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')

    if(isValid) {
      uploadError = null
    }

    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype] 
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })



router.get(`/`,async (req, res)=>{
  //http://localhost:3000/api/v1/products?categories=15456461,5643231

  let filter = {}
  if(req.query.categories){
    filter = {category: req.query.categories.split(',')}
  }

  const productList = await Product.find(filter).populate('category')  
  if(!productList){
    res.status(500).json({succes:false})
  }
  res.send(productList)
 })

 router.get('/:id', async(req,res)=>{
  const product = await Product.findById(req.params.id).populate('category')

  if (!product){
      res.status(404).json({message: 'The product with the given ID was not found'})
  }
  res.status(200).send(product)
})
 
// router.post(`/`,async(req, res)=>{
//   const category = await Category.findById(req.body.category)
//   if(!category) return res.status(400).send('Invalid Category')

//   let product = new Product({
//     name: req.body.name,
//     description: req.body.description,
//     richDescription: req.body.richDescription,
//     image: req.body.image,
//     brand: req.body.brand,
//     price: req.body.price,
//     category: req.body.category,
//     countInStock: req.body.countInStock,
//     rating: req.body.rating,
//     numReviews: req.body.numReviews,
//     isFeatured: req.body.isFeatured,
//   })
//   product = await product.save() //product is created after saving it.
   
//   if(!product)
//   return res.status(500).send('The product can not be created')
   
//   res.send(product)

//  })

router.post(`/`, uploadOptions.single('image'), async(req, res) => {
  try {
    const categoryId = req.body.category
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).send('Invalid Category ID')
    // const category = await Category.findById(categoryId)
    // if (!category) return res.status(400).send('Invalid Category')
  
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-232323"
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured, 

    })
    product = await product.save() 
     
    if (!product)
    return res.status(500).send('The product cannot be created')
     
    res.status(200).json({message: 'Product created successfully', product})
  } catch (error) {
    console.log(error)
    res.status(500).send(`An error occurred: ${error.message}`)
  }
})

router.put('/:id', async(req,res) => {
  try{
    
    if (!mongoose.Types.ObjectId.isValid(req.body.category))
    return res.status(404).json({ message:'Invalid category ID' })

    // if (!mongoose.Types.ObjectId.isValid(req.params.id)){
    //   res.status(404).json({ message:'Invalid product ID' })
    // }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,{
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      {new : true}
    )
    
    if(!updatedProduct){
      return res.status(400).send('The product can not be updated.') //product id yanlış olursa
    }

    res.status(200).json({message: 'Product updated successfully', updatedProduct})

  } catch(err){
    console.log(err)
    res.status(500).send('An error occurred while updating the product')
  }
})

router.delete('/:id', (req,res)=>{
  Product.findByIdAndRemove(req.params.id).then(product => {
      if(product) {
          return res.status(201).json({succes:true, message: 'the product is deleted.'})
      } else {
          return res.status(404).json({succes:false, message:'product not found'})
      }
  }).catch((err) => {
      console.log(err)
      return res.status(500).json({succes:false, error:err})
  })
})

router.get('/get/count', async(req,res)=>{
  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      return res.status(404).json({ message:'there are no products' });
    } else {
      return res.status(200).json({ productCount: productCount });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.toString() });
  }
});

router.get('/get/featured/:count', async(req,res) =>{

  try{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count)

    if(!products){
      res.status(500).json({succes: false})
    }
    res.status(200).json(products)

  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }

})

 module.exports = router