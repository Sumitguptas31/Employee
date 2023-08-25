const userModel = require("../models/userModel")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

//for single file uploads
// const CreateUser = async function (req, res) {
//     try {
//         const data = req.body
//         const {name,age,gender,Hobbies,scores,images}=data
//         const fileUrl = `http://localhost:7000/${req.file.path}`
//         const NewUsers = await userModel.create({
//             name:name,
//             age:age,
//             gender:gender,
//             Hobbies:Hobbies,
//             scores:scores,
//             images:fileUrl
//         })
//         return res.status(201).send({ Status: true, msg: "Employee Added", data: NewUsers })
//     }
//     catch (error) {
//         return res.status(500).send(error.message)
//     }
// }




//********************************************************************************************* */
//for multiple file uploads:-
const CreateUser = async function (req, res) {
    try {
        const data = req.body
        const {name,age,gender,Hobbies,scores,images}=data
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
          }
        
          const fileUrls = req.files.map((file) => {
            // Construct the URL for accessing each uploaded file
            return `http://localhost:7000/uploads/${file.filename}`;
          });
        const NewUsers = await userModel.create({
            name:name,
            age:age,
            gender:gender,
            Hobbies:Hobbies,
            scores:scores,
            images:fileUrls
        })
        return res.status(201).send({ Status: true, msg: "Employee Added", data: NewUsers })
    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}

const updateUser = async function (req, res) {
    try {
        console.log("file",req.files)
        let data = req.body
        const { UserName, email, phone, active, image, gender } = data

        let id = req.params.Id
        let user = await userModel.findOne({ id: id })
        if (!user) {
            return res.status(400).send({ status: false, msg: "no user found" })
        }

        let newUser = await userModel.findOneAndUpdate({ _id: id },
            { $set: { UserName: UserName, email: email, phone: phone, active: active, image: image, gender: gender } },
            { new: true })
        res.status(201).send({ status: true, msg: 'user updated', data: newUser })

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

// const getUser = async function(req,res){
//     try{
//      const id= req.params.Id
//      const user= await userModel.findOne({_id:id})
//      if(!user){
//         res.status(404).send({status:false, msg:"no user found"})
//      }
//    res.status(201).send({status:true,msg:'fetched user',data:user})
//     }
//     catch(error){
//         res.status(500).send({status:false, msg:error.message})
//     }
// }
const getUser = async function (req, res) {
    try {
        //group by age and in name array push the name of each documents
        //  const user= await userModel.aggregate([{$group:{_id:"$age",name:{$push:"$name"}}}])

        //group by age and in pooraDoc array push the whole documents we use
        //$$ROOT query for that
        // const user= await userModel.aggregate([{$group:{_id:"$age",pooraDoc:{$push:"$$ROOT"}}}])

        //give count of male teachers of every age group and sort the count in desc order:-
        // let user = await userModel.aggregate([{ $match: { gender: "male" } },
        // { $group: { _id: "$age", count: { $sum: 1 } } },
        // { $sort: { count: -1 } }])


    // find max count:-
    //     let user= await userModel.aggregate([{$match:{gender:"female"}},
    //     {$group:{_id:"$age",count:{$sum:1}}},
    //     {$sort:{count:-1}},
    //     {$group:{_id:null,maxCount:{$max:"$count"}}}
    // ])

    //toDouble operator for sum of age for every group:-
    // let user= await userModel.aggregate([{$match:{gender:"female"}},{$group:{_id:"$age",SumOfAge:{$sum:"$age"}}}])
    // let user= await userModel.aggregate([{$match:{gender:"male"}},{$group:{_id:"$age",sumofAge:{$sum:{$toDouble:"$age"}}}}])
    
    // $unwind:
    // let user= await userModel.aggregate([{$match:{gender:"male"}},{$unwind:"$Hobbies"}])
//     let user= await userModel.aggregate([{$match:{gender:"male"}},
//     {$unwind:"$Hobbies"},
//     {$group:{_id:"$age",hobbies:{$push:"$Hobbies"}}}
// ])
    
  //$avg:-
//   let user= await userModel.aggregate([{$group:{_id:null,averageAge:{$avg:"$age"}}}])
//         res.status(201).send({ status: true, msg: 'fetched user', data: user })

//find count of the hobbies of all the students:
//first method:
// we simply unwind the Hobbies array for each documents,new documets will become for each documents then will group all the documets by using _id:null then will add 1 for each documents and return final sum in countofhobbies field.
// let user= await userModel.aggregate([{$unwind:"$Hobbies"},{$group:{_id:null,countofhobbies:{$sum:1}}}])

//second method:-
// let user= await userModel.aggregate([{$group:{_id:null,countofhobbies:{$sum:{$size:"$Hobbies"}}}}]) //this step will find error for if any document has no hobbies or it's null
//now will use $ifnull method inside size if null then return empty array or whatever you want:
// let user= await userModel.aggregate([{$group:{_id:null,countofallhobbies:{$sum:{$size:{$ifNull:["$Hobbies",[]]}}}}}])

//List of all the hobbies:
//first method is $push
// let user= await userModel.aggregate([{$unwind:"$Hobbies"},{$group:{_id:null,allhobbies:{$push:"$Hobbies"}}}])
//second method use $addToSet it's same like $push but it not return dublicate value eg: here it will not return dublicate hobbies.
// let user= await userModel.aggregate([{$unwind:"$Hobbies"},{$group:{_id:null,allhobbies:{$addToSet:"$Hobbies"}}}])

//$filter:
let user= await userModel.aggregate([{$group:{_id:null,averageHobbies:{$avg:{$filter:{
    input:"$Hobbies",
    as:"hobbies",
    cond:{$gt:["$age",20]}
}}}}}])
res.status(201).send({ status: true, msg: 'fetched user', data: user })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteUser = async function (req, res) {

    try {
        let id = req.params.bookId
        let userdetails = userModel.findOne({ _id: id })
        if (!userdetails) {
            res.status(400).send({ status: false, msg: "Bad request" })
        }
        let newUserData = await userModel.remove({ id: id })

        res.status(200).send({ sataus: true, msg: "successfully deleted" })
    }

    catch (error) {

        res.status(500).send({ status: false, msg: error.message })

    }
}

const sortUser = async function (req, res) {
    try {
        let sort_order = req.body.sort_order
        if (sort_order) {
            if (sort_order != "1" && sort_order != "-1") {
                res.status(404).send({ status: false, msg: "sort order value must be 1 or -1" })
            }
            if (sort_order == "1") {
                let sort_data = await userModel.find().sort({ email: 1, UserName: 1 })
                res.status(200).send({ status: true, msg: "categories sorted in ascending order", data: sort_data })
            }
            if (sort_order == "-1") {
                let sort_data = await userModel.find().sort({ email: -1, UserName: -1 })
                res.status(200).send({ status: true, msg: "categories sorted in decending order", data: sort_data })
            }
        }

    }
    catch (error) {

        res.status(500).send({ status: false, msg: error.message })

    }
}
const Pagination = async function (req, res) {
    try {

        let data = await userModel.find().limit(1)
        res.status(200).send({ status: true, msg: "Pagination set to 10", data: data })

    }

    catch (error) {

        res.status(500).send({ status: false, msg: error.message })

    }
}
module.exports = { CreateUser, updateUser, getUser, deleteUser, sortUser, Pagination }