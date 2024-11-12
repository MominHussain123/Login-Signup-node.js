const mongoose = require("mongoose");


const connectdb = ()=>{
    const db = process.env.MONGODB_URL;

    mongoose.connect(db).then(() => {
        console.log("Connected");
    }).catch((err) => {
        console.log("Not connect " + err);
    });
}

module.exports = connectdb