// trying to make the signup dynamic by sending data from the server //

const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

// express has the middleware json to covert the incoming json to use it.
// this use will be handled for all the routes as we are not providing any specific route.

app.use(express.json());
app.post("/signup", async(req, res)=>{
    // console.log(req.body); // we cannot directly use req, so use express json middleware


    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added");
    }catch(error){
        res.status(400).send("Cannot Add User");
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