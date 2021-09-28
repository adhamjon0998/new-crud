const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/User')

const app = express()

//routes

const coursesRouter = require('./routes/courses')
const addRouter = require('./routes/add')
const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    partialsDir: [path.join(__dirname, 'views/partials')],
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('61519620321bff71a15a4416')
        req.user = user
        next()
    } catch (e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/courses', coursesRouter)
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/card', cardRouter)
const PORT = process.env.PORT || 3000


async function start() {
    try {
        const URI = 'mongodb+srv://adham:AoB7uTgPAO1tuD2a@cluster0.npirv.mongodb.net/Sertifikat'
        await mongoose.connect(URI)
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'Adham@mail.ru',
                name: 'Adhamjon',
                cart: { items: [] }
            })
            await user.save()
        }
        app.listen(PORT, (req, res) => {
            console.log(`Server working on ${PORT} port`)
            console.log(`Server working on MongoDb`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()