var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');
var User = require('../models/user');
/* GET admin listing. */

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/', isAdmin, function(req, res, next){
  res.send('response with admin');
});

router.get('/dashboard',isAdmin, function(req, res, next){
  res.redirect('/orders/display-orders');
});

router.get('/display-all-users', isAdmin, function(req, res){
  //console.log('display all user');
  User.find({}).exec(function(err, user){
    if(err){
      return res.write('Error to find user details.');
    }
    else{
      var users = [];
      for(var i = 0 ; i < user.length ; i++){
        if(!user[i].admin){
          users.push(user[i]);
        }
      }
      //console.log(users);
      res.render('admin/display-all-users',{title: 'all user', users: users});
    }
  });
});

router.get('/delete-user/:id', isAdmin, function(req, res){
  var id = req.params.id;
  User.findByIdAndRemove({_id: id}).exec(function(err,doc){
    if(err){
      return res.write('error to delete user.');
    }
    res.redirect('/admin/display-all-users');
  });
});

router.get('/add-admin', isAdmin, function(req, res, next){
  var messages = req.flash('error');
  res.render('admin/add-admin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/add-admin',isAdmin, function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  
  User.findOne({'email': email}, function(err, user){
      if(err){
      return  res.render('admin/add-admin',{csrfToken: req.csrfToken(), messages: 'Error to find admin in the database!'});
      }
      if(user){
        return res.render('admin/add-admin',{csrfToken: req.csrfToken(), messages: 'Email is already in use.'});
      }else{
        var newAdmin = new User();
        newAdmin.email = email;
        newAdmin.password = newAdmin.encryptPassword(password);
        newAdmin.admin = true;
        
        newAdmin.save(function(err, adminUser){
            if(err){
              return  res.render('admin/add-admin',{csrfToken: req.csrfToken(), messages: 'Error to save admin details!'});
            }
            //console.log('admin: ' + adminUser);
            res.redirect('/admin/add-admin');
        });
      }
  });
});

router.get('/display-admin', isAdmin, function(req, res, next){
  //console.log(req.user);
  if(req.user.email != "riponsarkar21@gmail.com"){
    return res.send("You don't have the permission to enter here. please don't mind!");
  }
  User.find({}).exec(function(err, adminUser){
    if(err){
      return  res.send('error to find admin.');
    }
    //console.log('adminUser: ' + adminUser);
    var admins = [];
    for(var i = 0 ; i < adminUser.length ; i++){
      if(adminUser[i].admin){
        admins.push(adminUser[i]);
      }
    }
    //console.log('all admins: ' + admins);
    res.render('admin/display-all-admin', {title:'all admin',admins: admins});
  });
});

router.get('/delete-admin/:id', isAdmin, function(req, res){
  var id = req.params.id;
  User.findByIdAndRemove({_id: id},function(err, result){
    if(err){
      return res.send('error to delete admin.');
    }else{
      res.redirect('/admin/display-admin');
    }
  });
});

module.exports = router;

function isAdmin(req, res, next){
  //console.log('admin: ' + req.user);
  if(req.isAuthenticated() && req.user.admin == true){
    return next();
  }
  res.redirect('/');
}
