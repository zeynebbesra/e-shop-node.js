const {Category} = require('../models/user')
const express = require('express')
const router = express.Router()

router.get(`/`, async(req,res)=>{
    const userList = await Category.find()

    if(!categoryList){
        res.status(500).json({succes: false})
    }
    res.send(categoryListList)
})

module.exports = router