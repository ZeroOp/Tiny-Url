const mongoose = require('mongoose');
class DataBase{
    constructor(){
        this.connect();
    }
    connect(){
        mongoose.connect("mongodb://localhost/urlShortner")
        .then(()=>{
            console.log("Database is connected");
        })
        .catch((err)=>{
            console.log(err);
        })
    }
}
module.exports = new DataBase();