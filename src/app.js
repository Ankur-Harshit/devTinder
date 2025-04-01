const express = require('express');
const app = express();

app.use("/hello", (req, res)=>{
    res.send("Hello Hello Hello Amla Toli Durga Puja Samiti");
})

app.use("/test", (req, res)=>{
    res.send("Hello from the Testing Server");
})

app.use("/", (req, res)=>{
    res.send("Hello from the Server");
})


app.listen(3000, ()=>{
    console.log("Server is sucessfully listening on port 3000...");
})