const {Order} = require('../models/user')
const express = require('express')
const router = express.Router()

router.get(`/`, async(req,res)=>{
    const userList = await Order.find()

    if(!orderList){
        res.status(500).json({succes: false})
    }
    res.send(orderList)
})

module.exports = router