var express = require('express');
var router = express.Router();
var userModel = require('../modules/user.js');
var addPassCatModel = require('../modules/pass_cat.js');
var addPassModel = require('../modules/add-password-details.js');
var bycript = require('bcryptjs'); 
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getPassCat = addPassCatModel.find();

// invalid token - synchronous
function checkLoginUser(req,res,next){
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
     res.redirect('/');
  }
  next();
}


// Get Json Token 
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* validation start */
 function checkEmail(req,res,next){
   var email = req.body.email;
   var checkExistEmail = userModel.findOne({ email:email });
   checkExistEmail.exec((err, data) => {
      if(err) throw err;
      if(data){
        return res.render('register', { title: 'Sign Up', msg: 'Email Already Exist' });
      }
      next();
   });
 }

function checkUserName(req,res,next){
   var username = req.body.uname;
   var checkExistUserId = userModel.findOne({ username:username });
   checkExistUserId.exec((err, data) => {
      if(err) throw err;
      if(data){
        return res.render('register', { title: 'Sign Up', msg: 'Username Already Exist' });
      }
      next();
   });
 }
 
 router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');  
      getPassCat.exec((err, data)=>{
      if (err) throw err; 
      res.render('add_new_password_details', { title: 'Edit Password Category',loginUser: loginUser, record: data});
    });

    
  });

router.post('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var pass_name= req.body.passName;
  var pass_cat= req.body.passCat;
  var pass_details= req.body.passDetails;
  
  var password_details= new addPassModel({
    pass_project_name: pass_name,
    pass_category: pass_cat,
    pass_details: pass_details
  });
      
    password_details.save(function(err,doc){
      getPassCat.exec(function(err,data){
        if(err) throw err;
      res.render('add_new_password_details', { title: 'Password Management System',record: data, loginUser: loginUser });
    
    });
    
  });
});

  module.exports = router;