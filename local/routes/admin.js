const { Router } = require('express')
const router = Router()

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        title: 'Admin',
        layout: 'admin'
    })
})

module.exports = router