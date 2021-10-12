const { Router } = require('express')
const router = Router()
const fileMiddleware = require('../middleware/file')
const toDelete = require('../middleware/toDelete')
const Home = require('../models/Home')

router.get('/home', async (req, res) => {
    const homes = await Home.find()
    res.render('admin/home', {
        title: 'Homes',
        layout: 'admin',
        homes
    })
})

router.get('/home/add', (req, res) => {
    res.render('admin/addHome', {
        title: 'Create home',
        layout: 'admin'
    })
})

router.post('/home/add', fileMiddleware.single('img'), async (req, res) => {
    const { name } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ''
    }
    const homeCategory = new Home({
        name,
        img
    })
    await homeCategory.save()
    res.redirect('/admin/home')
})

router.get('/adhamjon/edit/:id', fileMiddleware.single('img'), async (req, res) => {
    const home = await Home.findById(req.params.id)
    res.render('admin/editHome', {
        title: 'Edit home',
        layout: 'admin',
        home
    })
})

router.post('/adhamjon/edit/:id', fileMiddleware.single('img'), async (req, res) => {
    const { img } = await Home.findById(req.params.id)
    const admin = req.body
    if (req.file) {
        admin.img = req.file.filename
        toDelete(img)
    } else {
        admin.img = img
    }
    await Home.findByIdAndUpdate(req.params.id, admin, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/home')
        }
    })
})

router.get('/adhamjon/delete/:id', async (req, res) => {
    const { img } = await Home.findById(req.params.id)
    toDelete(img)
    await Home.findOneAndDelete(req.params.id)
    res.redirect('/admin/home')
})


module.exports = router