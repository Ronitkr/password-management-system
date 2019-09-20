const mongoDB = require('mongoose');
mongoDB.connect('mongodb://localhost:27017/pms',
    {useNewUrlParser: true, useCreateIndex: true,});
var conn = mongoDB.Collection;
var userSchema = new mongoDB.Schema({
    username: {
        type: String,
        required: true,
        index:{
            unique: true,
        }
    },

    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    }, 

    password: {
        type: String,
        required: true,
    },

    phone_no: {
        type: Number,
        required: true,
        index: {
            unique: true,
        }
    },

    date: { 
        type: Date,
        default: Date.now
    }
});
var userModel = mongoDB.model('users',userSchema);

module.exports = userModel;  