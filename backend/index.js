const app = require('express')()
const consign = require('consign')
const database = require('./config/database')
const mongoose = require('mongoose')

require('./config/mongodb')

app.database = database
app.mongoose = mongoose
const port = 3000

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () => {
    console.log('\x1b[32m%s\x1b[0m', `Backend rodando na porta: ${port}` ,'\x1b[0m')
})