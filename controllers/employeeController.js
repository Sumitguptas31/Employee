const employeeModel = require("../models/employeeModel")
const awsFile = require('aws-sdk')


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


awsFile.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

const uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        const s3 = new awsFile.S3({ appVersion: '2006-03-01' })

        const uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "shoppingCart /" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {

            if (err) return reject({ error: err })
            console.log(" file uploaded succesfully ")
            return resolve(data.Location)
        })

    }
    )
}

const CreateUser = async function (req, res) {
    try {
        const data = req.body
        const { UserName, email,phone,active,profileImage, gender} = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if (!isValid(UserName)) {
            return res.status(400).send({status: false, msg: "Enter Title " })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        const isemail = await employeeModel.findOne({ email })
        if (isemail) {
            return res.status(400).send({status: false, msg: "Email.  is already used" })
        }

        if (!isValid(phone)) {
            return res.status(400).send({status: false, msg: "Enter phone no. " })
        }
        const isphone = await employeeModel.findOne({ phone })
        if (isphone) {
            return res.status(400).send({status: false, msg: "Phone no.  is already used" })
        }
        if (!(/^[6-9]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, message: `Phone number should be a valid number` })
        }
        let files = req.files
        if (files && files.length > 0) {
            data["profileImage"] = await uploadFile(files[0])
        } 
        const NewUsers = await employeeModel.create(data)
        return res.status(201).send({ Status: true, msg: "Employee Added", data: NewUsers })

    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}


const updateUser = async function(req,res){
    try{
        let data= req.body
        const { UserName, email,phone,active,profileImage, gender} = data

         let id= req.params.Id
         let user = await employeeModel.findOne({id:id})
         if(!user){
            return res.status(400).send({status:false,msg:"no user found"})
        }
        
         let newUser= await employeeModel.findOneAndUpdate( { _id:id},
            { $set: {UserName:UserName,email:email,phone:phone,active:active,profileImage:profileImage,gender:gender} },
            { new: true })
            res.status(201).send({status:true,msg:'user updated',data:newUser})

    }
    catch(error){
        res.status(500).send({status:false,msg:error.message})
    }
}

const getUser = async function(req,res){
    try{
     const id= req.params.Id
     const user= await employeeModel.findOne({_id:id})
     if(!user){
        res.status(404).send({status:false, msg:"no user found"})
     }
   res.status(201).send({status:true,msg:'fetched user',data:user})
    }
    catch(error){
        res.status(500).send({status:false, msg:error.message})
    }
}

const deleteUser= async function(req,res){

    try{
        let id= req.params.bookId
        let userdetails= employeeModel.findOne({_id:id})
        if(!userdetails){
            res.status(400).send({status:false,msg:"Bad request"})
        }
            let newUserData= await employeeModel.remove({id:id})
    
        res.status(200).send({sataus:true,msg:"successfully deleted"})
    }

catch(error){
 
    res.status(500).send({status:false,msg:error.message})
     
}
}

const sortUser= async function(req,res){
    try{
        let sort_order= req.body.sort_order
        if (sort_order) {
            if (sort_order != "1" && sort_order != "-1") {
                res.status(404).send({ status: false, msg: "sort order value must be 1 or -1" })
            }
            if (sort_order == "1") {
                let sort_data = await employeeModel.find().sort({email:1,UserName:1})
                res.status(200).send({ status: true, msg: "categories sorted in ascending order", data: sort_data })
            }
            if (sort_order == "-1") {
                let sort_data = await employeeModel.find().sort({email:-1,UserName:-1})
                res.status(200).send({ status: true, msg: "categories sorted in decending order", data: sort_data })
            }
        }

    }
    catch(error){
 
        res.status(500).send({status:false,msg:error.message})
        
    }
}
const Pagination= async function(req,res){
    try{
                
                let data = await employeeModel.find().limit(1)
                res.status(200).send({ status: true, msg: "Pagination set to 10", data:data })
            
        }

    catch(error){
 
        res.status(500).send({status:false,msg:error.message})
        
    }
}

function up(){
    return new Promise((resolve, reject) => {
        resolve()
    })
}
module.exports= {CreateUser,updateUser,getUser,deleteUser,sortUser,Pagination,up}