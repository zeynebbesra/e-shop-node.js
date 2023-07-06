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
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        return res.status(200).json({message: 'User authenticated.',user: user.email, token: token})
    } else {
        return res.status(400).json({message: 'Password is wrong!'})
    }
    
})

//for admin
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

router.put('/:id', async (req,res)=>{
    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else{
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.status(200).json({message: 'your information has been successfully updated', user})
})


router.post('/register', async(req,res)=>{
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

router.delete('/:id', (req,res)=>{
    User.findByIdAndRemove(req.params.id).then( user =>{
        if(user) {
            return res.status(201).json({success: true, message: 'the user is deleted!'})
        } else{
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
        return res.status(500).json({success: false, error: err}) 
    })
})

router.get('/get/count', async(req, res)=>{
    try{
        const userCount = await User.countDocuments()

        if (userCount===0) {
            return res.status(404).json({message:'there are no users'})
        } else {
            return res.status(200).json({userCount: userCount});
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.toString() });
      }
})


module.exports = router