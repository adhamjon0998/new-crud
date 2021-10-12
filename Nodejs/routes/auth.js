const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')
const { registerValidators } = require('../utils/validators')

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})
router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                // const user = await User.findById('6152ad115eb68a64d0c0fe5a')
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Такого пользователя не существует')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Неверный пароль')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const { email, password, name } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart: { items: [] }
        })
        await user.save()
        res.redirect('/auth/login#login')

    } catch (e) {
        console.log(e);
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забилы пароль',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Попторите попитку позже')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')

            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resettokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail()
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e);
    }
})

module.exports = router