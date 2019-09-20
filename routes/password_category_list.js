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
  var getPassCat = addPassCatModel.find();
    
    getPassCat.exec((err, data) => {
      if (err) throw err;
      
      res.render('password_category_list', { title: 'Password Details', records: data, loginUser: loginUser });
  
    });
  });
  
  /*  Delete password category page strat  */
  
  router.get('/delete/:id', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passCatGetId = req.params.id; 
    var deletePassCat = addPassCatModel.findByIdAndDelete(passCatGetId);
    deletePassCat.exec((err) => {
      if (err) throw err;
      res.redirect('/users/password_category_list')
    });
    
  });
  
  /*  Edit password category page strat  */
  
  router.get('/edit/:id', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passCatGetId = req.params.id; 
    var editPassCat = addPassCatModel.findById(passCatGetId);
    editPassCat.exec((err, data) => {
      if (err) throw err;
      
      res.render('edit_pass_category', { title: 'Edit Password Category', records: data, id: passCatGetId, loginUser: loginUser });
    });
    // res.render('edit_pass_category', { title: 'Edit Password Category',  success: '' });
    
  });
  
  router.post('/edit/', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passCatGetId = req.body.id; 
    var passCatGet = req.body.addPwdCategory; 
    var updatePassCat = addPassCatModel.findByIdAndUpdate(passCatGetId, {pass_category:passCatGet});
    updatePassCat.exec((err, data) => {
      if (err) throw err;
      res.redirect('/users/password_category_list');
    }); 
  });
  
  module.exports = router;  