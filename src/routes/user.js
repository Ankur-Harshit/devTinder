const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const User = require("../models/user");

userRouter.get("/user/requests/recieved", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId", 
            "firstName lastName photoUrl age gender about skills"
        );
        res.json({
            message:"Data Fetched Successfully",
            data: connectionRequests,
        });
    }
    catch(err){
        res.status(404).send({message:"Error: "+ err.message});
    }
});

userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});
    }
    catch(err){
        res.status(404).send({message:"Error: "+err.message});
    }
});

userRouter.get("/feed", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;
        if(limit>50) limit = 50;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{fromUserId: loggedInUser._id},{toUserId: loggedInUser._id},]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const Users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send({data: Users});

    }
    catch(err){
        res.status(400).json({message: "Error: "+ err.message});
    }
});

module.exports = userRouter;