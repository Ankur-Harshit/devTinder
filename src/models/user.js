// always try to add proper validations in the fields of the database //
// Users should not be able to randomly enter the stuffs //
// Never Trust req.body //

const validator = require('validator');
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required : true,
        minLength : 4,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email Id is not valid");
            }
        }
    },
    password:{
        type: String,
        required : true,
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Not Valid");
            }
        }
    },
    photoUrl:{
        type : String,
        default : "https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL");
            }
        }
    },
    about:{
        type : String,
        default : "This is the default for the User",
    },
    skills:{
        type : [String],
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("user",userSchema);