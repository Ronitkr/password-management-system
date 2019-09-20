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
 
/* validation end */ 
/*  Login page start  */
router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('./dashboard');
  }else{
    res.render('login', { title: 'Login', msg: '' });
  }
  // res.render('login', { title: 'Login', msg: '' });
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password   = req.body.pwd;

  var checkEmail = userModel.findOne({ email:email });
  checkEmail.exec((err, data) => {
    if(err) throw err;
    var getUserId  = data._id;
    var getUsername  = data.username;
    var getPassword  = data.password;
    
    if(bycript.compareSync(password, getPassword)){
      var token = jwt.sign({ userId: getUserId }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', getUsername);
      res.redirect('/dashboard');
    }
    else{
      res.render('login', { title: 'Login', msg: 'Invalid Email/Password' });
    }
  }); 
});

router.get('/logout', function(req, res, next) {  
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');

});

/*  Login page end  */




/*  Register page start  */
router.get('/register', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('/dashboard');
  }else{
    res.render('register', { title: 'Sign Up', msg: '' });
  }  
  // res.render('register', { title: 'Sign Up', msg: '' });
  

});

router.post('/register', checkEmail, checkUserName,function(req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var pwd = req.body.pwd;
  var cpwd = req.body.cpwd;
  var mob = req.body.mob;

  if(pwd != cpwd){
    res.render('register', { title: 'Sign Up', msg: 'Password not matched' });
  }else{

    pwd = bycript.hashSync(pwd, 10);
    var userDetails = new userModel({
      username: username,
      email: email,
      password: pwd,
      phone_no: mob
    });
    
    userDetails.save((err, data) => {
      if(err) throw err;
      res.render('register', { title: 'Sign Up', msg: 'submit suceess fully' });
    })
  }
});

/*  Register page end  */


/*  Add password category page strat  */

// router.get('/users/password_category_list', function(req, res, next) {

//   res.render('', { title: 'Password Details' });
// });




/** 
router.get('/users/password-details', function(req, res, next) {
      var passDetails  = addPassModel.find();
      console.log(passDetails);
      passDetails.exec((err, data)=>{
        if(err) throw err;
        res.render('password-details', { title: 'Password Management System',record: data });
      })
});
*/




module.exports = router;
