const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://ankurharshit:JI5X8UQXEWjt5u7C@ankurmongodb.o0mik3w.mongodb.net/devtinder"
    );
};
module.exports = connectDB;