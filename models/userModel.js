const mongoose = require('mongoose');

const employeeModel = new mongoose.Schema(
    {
        name: { type: String, required: true },
        age: {
            type: Number,
            required: true,
        },
        gender: { type: String,required: true},
        Hobbies:{
            type:Array
        },
        scores:{
            type:Array
        },
        images:{
            type:Array
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('myuserdatas', employeeModel);





