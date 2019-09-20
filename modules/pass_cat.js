const mongoDB = require('mongoose');
mongoDB.connect('mongodb://localhost:27017/pms',
    {useNewUrlParser: true, useCreateIndex: true,});
var conn = mongoDB.Collection;

/* password add schmea */
var addPassCatSchema = new mongoDB.Schema({
    pass_category: {
        type: String,
        required: true,
        index:{
            unique: true,
        }
    },

    date: { 
        type: Date,
        default: Date.now
    }
});
var addPassCatModel = mongoDB.model('passCat',addPassCatSchema);



module.exports = addPassCatModel;  