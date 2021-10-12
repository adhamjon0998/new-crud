const express = require('express');
const exhbs = require('express-handlebars')
const path = require('path');
const mongoose = require('mongoose')

const adminRouter = require('./routes/admin')
const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories')
const homeRouter = require('./routes/home')
const productsRouter = require('./routes/products')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exhbs({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    extname: 'hbs',
    partialsDir: [
        path.join(__dirname, 'views/partials'),
    ],
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
    }
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter)
app.use('/admin', categoriesRouter)
app.use('/admin', homeRouter)
app.use('/admin', productsRouter)


async function start() {
    const URI = 'mongodb+srv://adham:g35jTvDOGZXTgskP@cluster0.npirv.mongodb.net/home'
    try {
        await mongoose.connect(URI)
        const PORT = process.env.PORT || 3000
        app.listen(PORT, (req, res) => {
            console.log(`Server working on ${PORT} port`);
            console.log(`Server working on MongoDb`);
        })

    } catch (e) {
        console.log(e);
    }
}
start()

module.exports = app;