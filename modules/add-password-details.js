const mongoDB = require('mongoose');
mongoDB.connect('mongodb://localhost:27017/pms',
    {useNewUrlParser: true, useCreateIndex: true,});
var conn = mongoDB.Collection;

/* password add schmea */
var addPassSchema = new mongoDB.Schema({
    
    pass_category: {
        type: String,
        required: true,
    },
    pass_project_name: {
        type: String,
        required: true,
    },
    pass_details: {
        type: String,
        required: true,
    },


    date: { 
        type: Date,
        default: Date.now
    }
});
var addPassModel = mongoDB.model('passDetails',addPassSchema);



module.exports = addPassModel;  