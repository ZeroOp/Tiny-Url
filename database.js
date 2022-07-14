const mongoose = require('mongoose');
class DataBase{
    constructor(){
        this.connect();
    }
    // "mongodb+srv://Zeroop:oIX5D0iqtmb1EeCx@cluster0.ob5ye5g.mongodb.net/?retryWrites=true&w=majority" this is the connection link to the database
    connect(){
        mongoose.connect("mongodb+srv://Zeroop:oIX5D0iqtmb1EeCx@cluster0.ob5ye5g.mongodb.net/Url-Shortner?retryWrites=true&w=majority")
        .then(()=>{
            console.log("Database is connected");
        })
        .catch((err)=>{
            console.log(err);
        })
    }
}
module.exports = new DataBase();
