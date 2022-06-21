const mongoose = require('mongoose');
const UserHashLinks = mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    shortUrl:{
        type:String,
        require:true,
        trim:true
    },
    discription:String,
    clicks:{
        type:Number , 
        default:0
    }
} , {timestamps:true});
module.exports = mongoose.model('userHashLinks' , UserHashLinks); // here we are exporting the whole model