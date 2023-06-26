const { Category } = require('../models/category')
const {Product} = require('../models/product')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

router.get(`/`,async (req, res)=>{
    const productList = await Product.find().populate('category')  
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

router.post(`/`, async(req, res) => {
  try {
    const categoryId = req.body.category
    if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).send('Invalid Category ID')
    const category = await Category.findById(categoryId)
    if (!category) return res.status(400).send('Invalid Category')
  
    let product = new Product({
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

    })
    product = await product.save() 
     
    if (!product)
    return res.status(500).send('The product cannot be created')
     
    res.send(product)
  } catch (error) {
    console.log(error)
    res.status(500).send(`An error occurred: ${error.message}`)
  }
})

router.put('/:id', async(req,res) => {
  try{
    const categoryId = req.body.category
    if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).send('Invalid Category ID')
    // const category = await Category.findById(categoryId)
    // if (!category) return res.status(400).send('Invalid Category')

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
      return res.status(400).send('The product can not be updated.')
    }

    res.status(200).json({updatedProduct, message: 'Product updated successfully'})

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
      res.status(500).json({ message:'there are no products' });
    } else {
      res.status(200).json({ productCount: productCount });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
});


 module.exports = router