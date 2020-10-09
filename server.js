const { response, request } = require('express');
const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/key')

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false,
})

mongoose.connection.on('connected', () => {
    console.log('Database Connected!!!!!')
})
mongoose.connection.on('error', err => {
    console.log('Error  +',err)
})



require('./models/user')
require('./models/post')

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if (process.env.NODE_ENV == "production") {
    app.use(express.static('frontend/build'))
    const path = require("path")
    app.get("*", (request, response) => {
        response.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    })
}


app.listen(PORT, () => {
    console.log('server is running on ' + PORT);
})



