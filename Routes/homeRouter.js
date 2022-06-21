const express = require('express');
const bodyparser = require('body-parser');
const validate = require('../validate');
const generateHash = require('../generateHash');
const UrlMaps = require('../Schemas/UrlMaps');
const baseUrl = "http://localhost:3000/"; 
const session = require('express-session');
const UserHashLinks = require('../Schemas/UserHashLinks');

const router = express.Router();

router.get('/' ,(req,res , next)=>{
    const payload = {};
    res.render('index' ,{errorMessage:"" , shortUrl:""});
})

router.post('/', async (req,res,next)=>{
    const payload = req.body;
    payload.errorMessage = "";
    payload.shortUrl = "";
    const longUrl = req.body.longUrl;
    if(validate(longUrl)){
        console.log("This is a valid url");
        const url = await UrlMaps.findOne({'longUrl':longUrl});
        if(url){
            payload.shortUrl = baseUrl +'/' + url.shortUrl;
            return res.render('index' , payload);
        }else{
            const newUrl = {
                shortUrl:generateHash(),
                longUrl:longUrl
            }
            UrlMaps.create(newUrl);
            payload.shortUrl = baseUrl +'/' + newUrl.shortUrl;
        }
        return res.render('index' ,payload );
    }
    console.log("This is invalide link");
    payload.errorMessage = "InValidUrl";
    res.render('index' , payload);
})
// all other requests will come here
router.get('/:shortUrl',async (req,res,next)=>{
    const user = req.session.user;
    const shortUrl = req.params.shortUrl;
    const url = await UrlMaps.findOne({'shortUrl':shortUrl});
    if(url){
        console.log('session user');
        console.log(user);
        if(user){
            const user_with_this_url = await UserHashLinks.findOne({
                $and:[
                    {'shortUrl':shortUrl},
                    {username:user.username}
                ]
            });
            if(user_with_this_url){
                user_with_this_url.clicks++;
                console.log(user_with_this_url);
                await user_with_this_url.save();
            }
        }
        url.clicks++;
        await url.save(); // we can use the save in mongoose like this
        return res.redirect(url.longUrl)
    }
    res.send("Page Not Found")
})
module.exports = router;