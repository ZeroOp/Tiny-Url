const express = require('express');
const session =require('express-session');
const shortid = require('shortid');
const router = express.Router();
const middleware = require('../middleware');
const generateHash = require('../generateHash');
const UserHashLinks = require('../Schemas/UserHashLinks');
const UrlMaps = require('../Schemas/UrlMaps')
const UserCustumLinks = require('../Schemas/UserCustumLinks');
const baseUrl = "http://localhost:3000/"; 
const app = express();
app.set("view engine" , "ejs");
app.set('views ' , "views");
router.get('/' , middleware , async (req, res , next)=>{
    const user = req.session.user;
    const user_hash_links = await UserHashLinks.find({username:user.username});
    const user_custum_links = await UserCustumLinks.find({username:user.username});
    const payload = {'user_hash_links':user_hash_links , 'user_custum_links':user_custum_links,'baseUrl':baseUrl , errorMessage:"" };
    res.render('dashboard' , payload);
})
router.post('/' ,middleware , async (req,res,next)=>{
    const payload = req.body;
    const user = req.session.user; 
    if(payload.custumUrl){
        // console.log('custum');
        // if the short Url is Not Empty
        // this is where the custm links are handled
        const url_custum_links = await UserCustumLinks.findOne({custumUrl:payload.custumUrl.trim()});
        if(url_custum_links){
            // custumUrl is already in use
           payload.errorMessage = "UrlExist";
           payload.user_hash_links = await UserHashLinks.find({username:user.username});
           payload.user_custum_links = await UserCustumLinks.find({username:user.username});
           payload.baseUrl = baseUrl;
           return res.render('dashboard',payload);
        }
        //here we have to create the custum url
        await UserCustumLinks.create({
            username:user.username,
            custumUrl:payload.custumUrl.trim(),
            longUrl:payload.longUrl,
            discription:payload.discription
        })
        .then((custumUrl)=>{
            console.log("custome Url has been created Successfull");
        })
        console.log("We have to create a custum url");
        return res.redirect('/dashboard');
    }
    // We have to create the random Hash Url
    // console.log("this is user hash links")
    const link = await UrlMaps.findOne({longUrl:payload.longUrl});
    if(link){
        var user_hash_links = await UserHashLinks.findOne({
            $and:[
                {username:user.username},
                {shortUrl:link.shortUrl}
            ]
        });
        console.log(user_hash_links)
        console.log(user);
        // we are creating the row if the user doesn't have the same link
        if(user_hash_links == null){
            await UserHashLinks.create({
                username:user.username,
                shortUrl:link.shortUrl,
                discription:payload.discription
            })
            .then(()=>{
                console.log('user hashlink is inserted');
            })
        }
    }else{
        await UrlMaps.create({
            shortUrl:generateHash(),
            longUrl:payload.longUrl
        })
        .then((link)=>{
            UserHashLinks.create({
                username:user.username,
                shortUrl:link.shortUrl,
                discription:payload.discription
            })
            .then(()=>{
                console.log("user hash link is inserted")
            })
        })
    }
    res.redirect('/dashboard');
})
module.exports = router;