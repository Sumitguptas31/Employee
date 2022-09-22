const mongoose = require('mongoose');

const employeeModel = new mongoose.Schema(
    {
        UserName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/
        },
        phone:{type:Number,required:true},
        active: { type: Boolean, required: true },
        profileImage: { type:Array, required: true },
        gender: { type: String,required: true},

    }, { timestamps: true }
)

module.exports = mongoose.model('employee', employeeModel);





