const adminAuth = (req, res, next)=>{
    const tok = "xyz";
    const ValidAdmin = tok==="xyz";
    if(!ValidAdmin){
        res.status(401).send("Unauthorised Access");
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth
}