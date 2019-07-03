var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var mongoose = require('mongoose');

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
var User = require('../models/user');
var CancleOrder = require('../models/cancle_order');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/cancle-order/:order_id',function(req, res){
  var order_id = req.params.order_id;
  console.log(order_id);
  console.log('user email: '+ req.email);

  var cancleOrder = new CancleOrder({
    _id: new mongoose.Types.ObjectId(),
    user_email: req.email,
    order_id: order_id
  });
  cancleOrder.save()
    .then(result => {
      res.redirect('/user/my-orders');
    })
    .catch(error =>{
      res.send('error to cancle orders.');
    });
});

router.get('/display-orders', isAdmin ,function(req, res, next){
  Order.find({}).sort({date: -1}).exec(function(err, orders){
    if(err){
      return res.write('Error to fetch order!');
    }
    var cart;
    //console.log('profile');
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    //console.log('orders:');
    //console.log(orders);
    res.render('orders/display-orders', { title: "display orders", orders: orders});
  });
});

router.get('/single-order-details/:order_id',isAdmin, function(req, res, next){
  var order_id = req.params.order_id;
  Order.findOne({_id: order_id}, function(err, order){
    if(err){
      return res.write('Error to fetch order!');
    }
    //console.log('orders : ' + order);
    
    res.render('orders/single-order-details', { title: "single order", order : order });
  });
});

router.get('/single-order-client/:order_id',isAdmin, function(req, res){
  var order_id = req.params.order_id;
  //console.log(order_id);
  Order.findOne({_id: order_id}, function(err, order){
    if(err){
      return res.write('Error to find order information.');
    }
    // console.log('Error : '+ err);
    // console.log('order information: ' + order);
    // console.log('user name: ' + order.name);
    var user_id = order.user;
    var user_info = {
      name: order.name,
      address: order.address,
      pickup_point: order.pickup_point,
      contact_number: order.contact_number,
      date: order.date
    };
    User.findOne({_id: user_id}, function(err, user){
      if(err){
        return res.write('Error to find client information.');
      }
      //console.log('user: ' + user);
      //console.log('user order info: ' + user_info);
      res.render('orders/user-details', { user: user, user_info: user_info });
    });
  });
});

router.get('/add-to-cart-or-order/:image_id', function(req , res, next){
  var product_id = req.session.single_product_id;
  //req.session.single_product_id = null;
  var image_id = req.params.image_id;
  // console.log(product_id);
  // console.log(image_id);

  Product.findOne({'_id': product_id}, function(err, docs){
    if(err){
      console.log('error to find data');
      //console.log(err);
    }else{
      //console.log('find data...');
      var doc;
      for(var i = 0; i < docs.images.length ; i++){
        if(docs.images[i]._id == image_id){
          doc = docs.images[i];
          break;
        }
      }
      var size_length = doc.sizes.length;
      // console.log(size_length);
      // console.log(doc);
      res.render('products/add-to-cart-or-order',{ title: 'add to cart or order',csrfToken: req.csrfToken(),product_id: product_id , product_image: doc, size_length: size_length});
    }
  });

  //res.render('products/add-to-cart-or-order',{ title: 'add to cart or order'});
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  //console.log(productId);
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/products/users/display-products');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    //console.log(req.session.cart);
    res.redirect('/products/users/display-products');
  });
});

router.post('/add-to-cart', function(req, res, next){
  var product_id = req.body.product_id;
  var product_image_id = req.body.product_image_id;
  var size = req.body.size;
  var quantity = req.body.quantity;
  var qty = parseInt(quantity, 10);
  // console.log(product_id);
  // console.log(product_image_id);
  // console.log(size);
   //console.log(qty + 6);

  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(product_id, function(err, product){
    if(err){
      return res.redirect('/products/users/single-product/' + product_id);
    }

    for(var i = 0 ; i < product.images.length ; i++){
      if(product.images[i]._id == product_image_id){
        var color_code = product.images[i].color_code;
        var img_path = product.images[i].img_path;
        break;
      }
    }
    //console.log(color_code);
    //console.log(img_path);
    var item = {
      id: product_image_id + size,
      product_id: product._id,
      image_id: product_image_id,
      price: product.price,
      title: product.title,
      color_code: color_code,
      img_path: img_path
    };
    //console.log('item:');
    //console.log(item);
    cart.add(product._id, product_image_id, item, size, qty);
    req.session.cart = cart;
    //console.log(req.session.cart);
    res.redirect('/products/users/single-product/' + product_id);
  }); 
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/orders/shooping-cart/');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/orders/shooping-cart/');
});

router.get('/shooping-cart/', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shooping-cart',{ title : 'shooping cart', products: null});
  }
  var cart = new Cart(req.session.cart);
  var product = cart.generateArray();
  //console.log(product);
  res.render('shop/shooping-cart', { products: cart.generateArray() , totalPrice: cart.totalPrice , title:'shooping cart'});
});

router.get('/checkoutAs/', function(req, res, nect){
  if(!req.session.cart){
    return res.redirect('/orders/shooping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { csrfToken: req.csrfToken(), total: cart.totalPrice , errMsg: errMsg, noErrors: !errMsg, title:'checkout'});
});

router.get('/checkout/', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/orders/shooping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { csrfToken: req.csrfToken(), total: cart.totalPrice , errMsg: errMsg, noErrors: !errMsg, title:'checkout'});
});

router.post('/checkout', function(req, res, next){
  //console.log('post checkout');
  //console.log(req.session.cart);
  if(!req.session.cart){
    return res.redirect('/orders/shooping-cart');
  }
  var cart = new Cart(req.session.cart);
  var order = new Order({
    _id: new mongoose.Types.ObjectId,
    user: req.user || null,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    pickup_point: req.body.pickup_point,
    contact_number: req.body.contact_number
  });
  //console.log('order');
  //console.log(order);
  order.save(function(err, result){
    //console.log('Error : ');
    //console.log(err);
    //console.log('result : ');
    //console.log(result);
    if(err){
      //console.log('error to save order...');
      req.flash('error', 'Error' );
      return res.redirect('/orders/checkout/');
    }
    else{
      req.flash('success', 'Successfully ordered.');
      req.session.cart = null;
      res.redirect('/');
    }
  });
});

// router.post('/checkout', function(req, res, next){
//   console.log('checkout');
// });

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = '/orders'+req.url;
  res.redirect('/users/signin');
}

function isAdmin(req, res, next){
  //console.log('admin: ' + req.user);
  if(req.isAuthenticated() && req.user.admin == true){
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