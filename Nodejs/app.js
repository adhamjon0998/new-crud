const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongodb-session')(session)
const path = require('path')
const compression = require('compression')
const mongoose = require('mongoose')
const varMiddlware = require('./middlware/variables')
const userMiddlware = require('./middlware/user')
const keys = require('./keys')
const errorHandler = require('./middlware/error')
const fileMiddlware = require('./middlware/file')
const auth = require('./middlware/auth')

const app = express()


//routes

const coursesRouter = require('./routes/courses')
const addRouter = require('./routes/add')
const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
    partialsDir: [path.join(__dirname, 'views/partials')],
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('6152ad115eb68a64d0c0fe5a')
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e);
//     }
// })

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: keys.SESSIN_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(flash())
app.use(compression())
app.use(varMiddlware)
app.use(userMiddlware)

app.use('/courses', coursesRouter)
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/card', cardRouter)
app.use('/orders', ordersRouter)
app.use('/profile',auth, profileRouter)
app.use('/auth', authRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3000


async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI)
        // const candidate = await User.findOne()
        // // if (!candidate) {
        // //     const user = new User({
        // //         email: 'Adham@mail.ru',
        // //         name: 'Adhamjon',
        // //         cart: { items: [] }
        // //     })
        // //     await user.save()
        // // }
        app.listen(PORT, (req, res) => {
            console.log(`Server working on ${PORT} port`)
            console.log(`Server working on MongoDb`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()

// https://blooming-ocean-40090.herokuapp.com/