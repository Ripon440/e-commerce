var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Category = require('../models/categories');
var Slider = require('../models/sliderProduct');

// var csrfProtection = csrf();
// router.use(csrfProtection);
// csrfToken: req.csrfToken()

var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({}).sort({code: -1}).exec(function(err, docs){
    if(err){
      //console.log('error to find date!');
      console.log(err);
    }else{
      //console.log('date: '+ docs[0].date);
      //console.log(docs[0].date.time);
      var flash = []; var collections = []; var upcoming = [];
      var flash_count = 0; var collections_count = 0; var upcoming_count = 0;
      for(var i = 0 ; i < docs.length ; i++){
        if(docs[i].collection_type == "flash" && flash_count < 6){
          flash.push(docs[i]);
          flash_count  = flash_count + 1;
        }
        else if(docs[i].collection_type == "collections" && collections_count < 6){
          collections.push(docs[i]);
          collections_count = collections_count + 1;
        }
        else if(docs[i].collection_type == "upcoming" && upcoming_count < 6){
          upcoming.push(docs[i]);
          upcoming_count = upcoming_count + 1;
        }
      }

      Category.find({}).sort({categoryName: 1}).exec(function(err, catego){
        //console.log(docs);
        var category = [];
        if(err){
          res.render('shop/home', { title: 'welcome to 7street', flash: flash, collections: collections, upcoming: upcoming,category: category });
        }else{
         
          var chunkSize = 10;
          for(var i = 0; i < catego.length; i += chunkSize){
            category.push(catego.slice(i, i + chunkSize));
          }
          
          console.log(category);

          // for(var i = 0 ; i < docs.length; i++){
          //   category.push(docs[i].categoryName);
          // }
          //console.log('category: ' + category);
          res.render('shop/home', { title: 'welcome to 7street', flash: flash, collections: collections, upcoming: upcoming,category: category });
        }
      });
      /*
      Slider.find({}).sort({date:-1}).exec(function(err, doc){
        if(doc){
          //console.log('slider images: '+doc);
          //console.log('collections product: '+ collections);
          //console.log('flash product: '+ flash);
          //console.log('upcoming product: '+ upcoming);
          res.render('shop/home', { title: 'welcome to 7street', flash: flash, collections: collections, upcoming: upcoming });
        }else{
          //console.log(err);
          res.render('shop/home', { title: 'welcome to 7street', flash: flash, collections: collections, upcoming: upcoming });
        }
      }); */

      //console.log('flash......'); console.log(flash);
      //console.log('collections....'); console.log(collections);
      //console.log('upcoming....'); console.log(upcoming);
    }
  });
});

router.post('/search', function(req, res){
  console.log('post search using ajax...!');
  var search_element = req.body.category;
  console.log('from pages: ' + search_element);
  //category,gender,title,collection_type;
  //db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
  Product.find({ $or: [ {title: {$regex: new RegExp(search_element)}}, {category: {$regex: new RegExp(search_element)}}, {gender: {$regex: new RegExp(search_element)}}]}).exec(function(err, docs){
      if(err){
        res.send('Error to find data!');
        console.log(err);
      }else{
        console.log('product details');
       // console.log(docs);
        var result = [];
        for(var i = 0 ; i < docs.length ; i++){
          var search_result={
            id: docs[i]._id,
            category:docs[i].category,
            gender:docs[i].gender,
            title:docs[i].title
          };
          result[i] = search_result;
          //console.log('search result: '+ search_result);
        }
        console.log('result: ');
        console.log(result);
        res.json(result);
      }
  });
});

router.get('/product-from-searchbar/:id', function(req, res, next){
  var id = req.params.id;
  //console.log('id : '+ id);
  
  Product.findById(id).exec(function(err1, doc){
    if(err1){
      res.send('error to find data!');
    }else{
      //console.log('single product: '+ doc);

      Product.find({title:doc.title}).exec(function(err2, result_title){
        if(err2){
          res.send('error to find all TITLE wise data!');
        }else{
          //console.log('title wise all product data: ');
          //console.log(result_title);
          
        
          Product.find({category:doc.category}).exec(function(err3, result_category){
            if(err3){
              res.send('error to find CATEGORY wise data!');
            }else{
              var others_category = [];
              var j = 0;
              for(var i = 0 ; i < result_category.length; i++){
                if(result_category[i].title != result_title[0].title){
                  others_category[j] = result_category[i];
                  j++;
                }
                
              }
              //console.log('category wise all product data: ');
              res.render('products/user/display-from-search', {search: result_title, others: others_category});
            }
          });
        }
      });
    }
  });
});

router.get('/return-policy', function(req, res){
  res.render('return-policy',{title: 'Return policy'});
});

router.get('/how-to-buy', function(req, res){
  res.render('how-to-buy',{title:'how to buy?'});
});
module.exports = router;