// trying to make the signup dynamic by sending data from the server //

const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("./utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

// express has the middleware json to covert the incoming json to use it.
// this use will be handled for all the routes as we are not providing any specific route.
app.use(cookieParser());
app.use(express.json());
// sign up API //
app.post("/signup", async(req, res)=>{
    // console.log(req.body); // we cannot directly use req, so use express json middleware

    //1. Validate the Data
    //2. Encrypt the Password
    //3. ADD the user into the data base

    try{
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;
        //encrypt the passsword//
        const passswordHash = await bcrypt.hash(password, 10);
        console.log(passswordHash);
        //const user = new User(req.body); bad way of creating user data //
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passswordHash,
        });
        await user.save();
        res.send("User Added");
    }catch(error){
        res.status(400).send(error.message);
    }
})

// Login API //

app.post("/login", async(req, res)=>{

    try{
        const {emailId, password} = req.body;
        if(emailId !== emailId.toLowerCase()){
            throw new Error("Email should be in lowercase only.");
        }
        if(!validator.isEmail(emailId)){
            throw new Error("Please Enter a valid Email");
        }
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", 
                {expiresIn: "1d"}
            );
            console.log(token);
            res.cookie("token", token);
            res.send("Login Successful!");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(error){
        res.status(400).send(error.message);
    }
})

// profile API

app.get("/profile", userAuth, async(req, res)=>{
    try {
        // const cookies = req.cookies;
        // const { token } = cookies;
        // if(!token){
        //     throw new Error("Invalid Token");
        // }

        // validate the token //
        // const decodedMessage = jwt.verify(token, "DEV@Tinder$790");
        // console.log(decodedMessage);
        // const { _id } = decodedMessage;
        // console.log("ID of the logged in User is " + _id);

        // in the auth middleware, we have already find the user, so no need to find here //
        // in the auth itself, we will attach user to the requesr //
        const user = req.user;
        // if(!user){
        //     throw new Error("User does Not exist");
        // }
        console.log(user.firstName + " is Logged in");


        // to read a cookie, we need a cookie parser //
        //console.log(cookies);
        res.send(user);
    }
    catch(error){
        res.status(400).send(error.message);
    }
    
})

// coonection request API //

app.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user.firstName+" Sent a connection Request!");
})


// How to get user details //

app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.find({emailId : userEmail});
        if(user.length===0) res.send("Cannot Find User"); // when not found it sends an array of length 0 //
        else
        res.send(user);
    }
    catch (err){
        res.status(400).send("Something went wrong");
    }
})

// get user by the ID //

app.get("/userId", async (req,res)=>{
    const userId = req.body._id;
    try{
        const user = await User.find({_id : userId});
        if(user.length===0) res.send("Cannot Find User");
        else
        res.send(user);
    }
    catch (err){
        res.status(400).send("Something went wrong");
    }
})

// Feed API //

app.get("/feed", async (req,res)=>{
    //const userEmail = req.body.emailId;
    try{
        const user = await User.find({});
        if(user.length===0) res.send("Cannot Find User"); // when not found it sends an array of length 0 //
        else
        res.send(user);
    }
    catch (err){
        res.status(400).send("Something went wrong");
    }
})


// Deleting From the Database
app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id : userId});
        // const user = await User.findByIdAndDelete(userId); // this can also be used directly as it is specified that it DeleteUserByID //
        res.send("User Deleted Successfuly");
    }
    catch (err){
        res.status(400).send("Something went wrong");
    }
})

// Updating from The DataBase //

app.patch("/user", async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    console.log(data);

    try{
        await User.findByIdAndUpdate({_id : userId}, data, {
            runValidators: true,
        });
        res.send("User Updated Successfuly");
    }
    catch (err){
        res.status(400).send(err.message);
    }
})


connectDB().then(()=>{
    console.log("Connection Established Done");
    app.listen(3000, ()=>{
        console.log("Server is sucessfully listening on port 3000...");
    })
}).catch((err)=>{
    console.error("Cannot Connect due to an Error");
});