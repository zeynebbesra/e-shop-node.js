const {Category} = require('../models/category')
const express = require('express')
const router = express.Router()

router.get(`/`, async(req,res)=>{
    const categoryList = await Category.find()

    if(!categoryList){
        res.status(500).json({succes: false})
    }
    res.status(200).send(categoryList)
})

router.get('/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id)

    if (!category){
        res.status(404).json({message: 'The category with the given ID was not found'})
    }
    res.status(200).send(category)
})

router.post('/', async(req,res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save()

    if(!category)
    return res.status(400).send('the category cannot be created.')

    res.status(201).json({message: 'Category created successfully', category})
})


router.put('/:id', async(req,res)=>{
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon || category.icon,
                color: req.body.color
            },
            {new: true}
        )

        if(!updatedCategory) {
            return res.status(400).send('The category can not be updated.')
        }

        // Başarılı durumda yanıt döndür
        res.status(200).json({message: 'Category updated successfully', updatedCategory});

    } catch (err) {
        console.log(err); // Sunucuda hata bilgisi loglanır
        res.status(500).send('An error occurred while updating the category.'); // Hata durumunda yanıt döndür
    }
});


// router.put('/:id', (req,res)=>{
//     const categoryID = req.params.id
//     Category.findById(categoryID).then((updatedCategory) =>{
//         if(!updatedCategory){
//             return res.status(404).json({ success: false, message: 'Category not found' });
//         }
//         else{
//             Category.findByIdAndUpdate(
//                 categoryID,
//                 {
//                     name: req.body.name,
//                     icon: req.body.icon,
//                     color: req.body.color
//                 },
//                 {new : true}
//             ).then(() => {
//                 return res.status(200).json({updatedCategory, message: "Category updated"})
//             })
//         }
//     }).catch((err)=> {
//         console.log(err)
//         return res.status(500).json({succes: false, error:err})
//     })
// })

router.delete('/:id', (req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(201).json({succes:true, message: 'the category is deleted.'})
        } else {
            return res.status(404).json({succes:false, message:'category not found'})
        }
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({succes:false, error:err})
    })
})


module.exports = router