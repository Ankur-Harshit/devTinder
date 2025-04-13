const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName){
        throw new Error("Name not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email Id is Not Valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password");
    }
}

module.exports = {validateSignUpData};