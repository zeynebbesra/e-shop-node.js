const {User} = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get(`/`, async(req,res)=>{
    const userList = await User.find().select('-passwordHash')

    if(!userList){
        res.status(500).json({succes: false})
    }
    res.send(userList)
})

router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash')

    if (!user){
        res.status(404).json({message: 'The user with the given ID was not found'})
    }
    res.status(200).send(user)
})

//we can make our server protected so no ne can use the api without a token
router.post('/login', async(req,res)=>{
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret
    if(!user){
        return res.status(404).json({message: 'The user not found!'})
    }
    
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){

        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            {expiresIn: '1w'}
        )
        return res.status(200).json({message: 'User authenticated.', token: token})
    } else {
        return res.status(400).json({message: 'Password is wrong!'})
    }
    
})

router.post('/', async(req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save()

    if(!user)
    return res.status(400).send('the user cannot be created.')

    res.status(201).json({message: 'user created successfully', user})
})


module.exports = router