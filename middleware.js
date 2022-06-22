const session = require('express-session');
module.exports = function(req , res ,next){
    if(req.session && req.session.user){
       return next();
    }
    else{
        if(req.body.submit == 'Generate Short URL'){
            // req.sesssion.add_url = req.body;
            // console.log(req.body)
            // req.session.addUrl = req.body; here there is no need to stor any thing useing the session
            return next(); // If it is a generat short Url then there is no need to Log it 
        }
    }
    req.session.addUrl = req.body;
    // console.log("Hi");
    // console.log(req.session.addUrl);
    return res.redirect('/login');
}