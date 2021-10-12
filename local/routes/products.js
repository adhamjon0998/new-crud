const { Router } = require('express')
const router = Router()
const Product = require('../models/Product')
const Category = require('../models/Category')
const fileMiddleware = require('../middleware/file')


router.get('/products', async (req, res) => {
    const products = await Product.find()
    res.render('admin/products', {
        layout: 'admin',
        title: 'Products',
        products
    })
})

router.get('/products/add', async (req, res) => {
    const categories = await Category.find()
    res.render('admin/addProducts', {
        layout: 'admin',
        title: 'Create Products',
        categories
    })
})

router.post('/products/add', fileMiddleware.single('img'), async (req, res) => {

    const { name, price, categoryId } = req.body
    req.file ? img = req.file.filename : img = ""
    console.log(price,"1111111111111111111111111111");
    const product = new Product({
        name,
        price,
        img,
        categoryId
    })
    await product.save()
    res.redirect('/admin/products')
})
module.exports = router