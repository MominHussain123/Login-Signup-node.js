const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    fullName:{
        type:String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    randomToken:{
        type: String,
    }
});

const Users = new mongoose.model("UserModel", userschema);

module.exports = { Users };

