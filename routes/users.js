var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
var User = require('../models/user');
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/reset-password', isLoggedIn,function(req, res){
  res.render('users/reset-password',{csrfToken: req.csrfToken(),email: req.user.email});
});

router.post('/reset-password', isLoggedIn, passport.authenticate('local.signin', {
  failureRedirect: '/users/signin',
  failureFlash: true
}),function(req, res,next){
  //console.log(req.user.email);
  res.render('users/change-password',{csrfToken: req.csrfToken(), email:req.user.email});
});

router.post('/change-password', isLoggedIn, function(req, res, next){
  console.log('change password......');
});

router.get('/profile',isLoggedIn, function(req, res, next){
  User.findOne({'email':req.user.email}).exec(function(err, profile){
    if(err){
      return res.write('Error to find user information..');
    }else{
      //console.log(profile);
      res.render('users/profile', { title: "user profile", userInfo: profile, orders: null});  
    }
  });
});

router.get('/my-orders', isLoggedIn, function(req, res, next){
  //console.log(req.user);
  Order.find({user: req.user}).sort({date: -1}).exec(function(err, orders){
    if(err){
      return res.write('Error to fetch order!');
    }
    var cart;
    //console.log('profile');
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    //console.log('after profile');
    //console.log(orders);
    // for(var i = 0 ; i < orders.length; i++){
    //   console.log('order number : '+ (i+1));
    //   console.log(orders[i].cart.items);
    // }
    res.render('users/profile', { title: "user profile", orders: orders, userInfo: null});
  });
});

router.get('/my-orders/:order',isLoggedIn, function(req, res, next){
  //console.log('interted into my orders');
  var order_id = req.params.order;
  //console.log('order id: '+ order_id);

  Order.findOne({_id: order_id}, function(err, order){
    if(err){
      return res.write('Error to fetch order!');
    }
    
   //console.log('Order: ' + order);
    res.render('users/my-orders-details', { title: "order-details", order : order });
  });
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a User');
});

router.get('/signup',function(req, res, next){
  var messages = req.flash('error');
  res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
   failureRedirect: '/users/signup',
   failureFlash: true
}), function(req, res, next){
  //console.log('user: '+ req.user);
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }
  else {
    res.redirect('/users/profile');
  }
});

router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('users/signin', { csrfToken: req.csrfToken(),  messages: messages, hasErrors: messages.length > 0, title: 'user sign in'});
});

router.post('/signin',  passport.authenticate('local.signin', {
  failureRedirect: '/users/signin',
  failureFlash: true
}), function(req, res, next){
  //console.log('user: ' + req.user);
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/users/profile');
  }
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}