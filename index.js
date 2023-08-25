const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');
const cors= require("cors")

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', route);
app.use(cors())

mongoose.connect("mongodb+srv://rahat6713:1819rahat@cluster0.iee0y.mongodb.net/sumit?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

// app.use('/uploads', express.static('uploads'));
app.listen(process.env.PORT || 7000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 7000))
});


