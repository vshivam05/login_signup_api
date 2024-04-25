import express from "express";
const app = express();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import user from "./model/user.js";
app.use(express.json());



dotenv.config();

const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;



// to get all users ................................
app.get("/", async (req,res)=>{

    let users;
try{
users = await user.find();
}catch(e){
console.log(e);
}

if(!users)
{
    res.status(404).json({Message:"No users found"})
}
    res.status(200).json({users:users})
})


// api for signup .........................................
app.post("/signup",async(req,res)=>{
const {name, email, password} =req.body;

let existingUser;
try{
    existingUser = await user.find({email: email});
}catch(e){
    res.status(404).json({message:"internal error"});
}

if(existingUser.length > 0)
{
    res.status(400).json({message:"User already Exists"});
}

const hashPassword = bcrypt.hashSync(password);

const User = new user({
name:name,
email:email,
password: hashPassword,

});

try{
    await User.save();
    res.status(201).json({User});
}catch(e){
    res.status(500).json({message:"Internal error"})
}


})



// api for login 

app.post("/login",async (req, res)=>{

    const {email, password} = req.body;

    let existingUser;
    try{
existingUser = await user.findOne({email:email});
    }catch(e){
        console.log(e);
    }

    if(!existingUser)
    {
        res.status(404).json({message:"User doesn't exists try to signup"})
    }

    res.status(200).json({message:"Login Successfully"});


})





mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.yr7vygl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(()=>{
    console.log("database connected successfully");
}).catch((e) => {
    console.log("error while connect to db",e);
  });
  



app.listen(5000, ()=>{
    console.log(`server is listening at PORT 5000`)
})