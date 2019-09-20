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
    var perPage = 3; 
    var page = req.params.page || 1;
    var passDetails  = addPassModel.find();
    passDetails.skip((perPage * page) - perPage)
          .limit(perPage).exec((err, data)=>{
            if(err) throw err;
            addPassModel.countDocuments({}).exec((err, count)=>{
              res.render('password-details', { title: 'Password Management System', loginUser: loginUser,record: data, current: page, pages: Math.ceil(count/perPage)});
          });
      });
  });
  
  router.get('/:page', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var perPage = 3; 
    var page = req.params.page || 1;
    var passDetails  = addPassModel.find();
    passDetails.skip((perPage * page) - perPage)
          .limit(perPage).exec((err, data)=>{
            if(err) throw err;
            addPassModel.countDocuments({}).exec((err, count)=>{
              res.render('password-details', { title: 'Password Management System', loginUser: loginUser, record: data, current: page, pages: Math.ceil(count/perPage)});
          });
      });
  });
  
  router.get('/delete/:id', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passDetailsId = req.params.id;
    var passDetailsDelete = addPassModel.findByIdAndDelete(passDetailsId);
  
    passDetailsDelete.exec((err)=>{
      if(err) throw err;
      res.redirect('/users/password-details/')
    }) 
  });
  
  router.get('/edit/:id', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passDetailsId = req.params.id;
    var passDetailsId = addPassModel.findById(passDetailsId);
  
    passDetailsId.exec((err, data)=>{
      if(err) throw err;
      var getPassCat = addPassCatModel.find();
      getPassCat.exec(function(err, data1){  
      res.render('edit-view-password', { title: 'Password Management System',record: data, records: data1, loginUser: loginUser});
      })
    }) 
  });
  
  router.post('/edit/:id', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passCatGetId = req.params.id;
    var editPassCat = req.body.passCat;
    var editPasstext = req.body.passDetails;
    var editPassName = req.body.passName;
    console.log(passCatGetId)
     
    var updatePassDetail = addPassModel.findByIdAndUpdate(passCatGetId, {
      pass_category: editPassCat,
      pass_project_name: editPassName,
      pass_details: editPasstext
    
    });
    updatePassDetail.exec((err) => {
      if (err) throw err;
      res.redirect('/users/password-details');
    }); 
  });
    
module.exports = router;