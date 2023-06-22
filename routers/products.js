const {Product} = require('../models/product')
const express = require('express')
const router = express.Router()

router.get(`/`,async (req, res)=>{
    const productList = await Product.find()
    if(!productList){
     res.status(500).json({succes:false})
    }
    res.send(productList)
 })
 
router.post(`/`,(req, res)=>{
   const product = new Product({
     name: req.body.name,
     image: req.body.image,
     countInStock: req.body.countInStock
   })
   product.save().then((created)=>{
     res.status(201).json(created)
   }).catch((err)=>{
     res.status(500).json({
         error: err,
         succes: false
     })
   })
 
 })

 module.exports = router