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
 
 /*  Add password category page strat  */
router.get('/' ,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    res.render('add-password-category', { title: 'Add Password Category', errors: '', success: '', loginUser: loginUser});      
});

router.post('/', [check('addPwdCategory', 'Enter min 3 Character').isLength({ min: 3 })], function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    
    res.render('add-password-category', { title: 'Add Password Category', errors: errors.mapped(), success: '', loginUser: loginUser});
  }else{
    var passCat = req.body.addPwdCategory;
    var passCatDetails = new addPassCatModel({
        pass_category: passCat,
    });

    passCatDetails.save((err, data)=>{
      if(err) throw err;
      res.render('add-password-category', { title: 'Add Password Category', errors: '', success: 'password category successfully added'});
    })
          
  }
  
});

module.exports = router;