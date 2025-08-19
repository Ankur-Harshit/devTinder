const express = require('express');
const connectDB = require("../config/database");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("../utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(404).send("Invalid status type!");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found!"});
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            // schema level search
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });

        if(existingConnectionRequest){
            return res.status(404).json({message:"Connection Request Already Exists"});
        }

        const data = await connectionRequest.save();
        res.json({
            message:"Connection Request Sent Successfully! ", 
            data,
        });
    }
    catch(err){
        res.status(404).send("Error: "+err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({message:"Not a valid status type"});
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if(!connectionRequest){
            return res.status(404).json({message:"User not found!"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message: "Connection request "+status, data});
    }
    catch(err){
        res.status(404).send({message:"Error: "+ err.message});
    }
})


module.exports = requestRouter;