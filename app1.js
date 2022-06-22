const express = require('express');
const session = require('express-session'); 
const app  = express();
app.use(session({
    secret:"hellow world", // this is the hashing for the session
    resave:true,
    saveUninitialized:false  
}));
app.get('/',(req,res)=>{
    if(req.session && req.session.hello == null){
        console.log("welecone");
        req.session.hello ="Hi Jayaram";
    }else{
        console.log("req.session.hello");
    }
    res.send("hello");

})
app.listen(3000 , ()=>{
    // req.session.hello = "Hi Jayaram";
    console.log("Hello")
})