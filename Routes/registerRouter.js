const express = require('express');
const router = express.Router();
const session = require('express-session');
const User = require('../Schemas/User');
const bcrypt = require('bcrypt');
router.get('/' , (req,res)=>{
    const payload = {errorMessage:""};
    payload.firstName = ""
    payload.lastName = ""
    payload.username = ""
    payload.email = ""
    payload.password = ""
    res.render('register' , payload);
});
router.post('/' ,async (req,res)=>{
    const payload = req.body;
    payload.errorMessage = "";
    const user = await User.findOne(
        {$or:[
            {username:payload.username},
            {email:payload.email}
        ]}
    );
    if(user){
        if(payload.email == user.email) payload.errorMessage = "EmailFound";
        else payload.errorMessage = "UsrFound";
        return res.render('register' , payload);
    }
    console.log(`this is the password`+payload.password);
    var data = {
        firstName:payload.firstName, 
        lastName:payload.lastName,
        username:payload.username ,
        email:payload.email,
        password:payload.password
    }
    await User.create(data)
    .then((user)=>{
        req.session.user = user;
    })
    console.log(req.session)
    res.redirect('/dashboard');
})
module.exports = router;