var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Product = require('../models/product');
var Category = require('../models/categories');
var multer = require('multer');
var Slider = require('../models/sliderProduct');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/productImages/');
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname + '-' + Date.now());
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
})


const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadImage = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
});
 
//var uploadImage = multer({ storage: storage });


/* GET product listing. */
router.get('/', function(req, res, next){
  res.send('response with products');
});

router.get('/add-category', isAdmin, function(req, res, next){
  //console.log('add-category');
  res.render('products/admin/add-category', {title: 'add category'});
});

router.post('/add-category', isAdmin, function(req, res, next){
  var category_name = req.body.category_name;
 // console.log(category_name);
  Category.findOne({categoryName: category_name }, function(err, result){
    if(result){
      //console.log(result);
      res.send('category already exist!');
    }else{
      //console.log(err);
      const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        categoryName: req.body.category_name
      });
      category
        .save()
        .then(rslt=>{
          //console.log(rslt);
          res.redirect('/products/add-category/');
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
  //res.redirect('/products/add-category/');
});

router.get('/delete-category/:id', isAdmin, function(req, res){
  //console.log('delete category');
  var id = req.params.id;
  //console.log(id);
  Category.findByIdAndRemove(id).exec(function(err, result){
    if(err){
      res.send('Failed to delete category!');
    }else{
      //console.log(result);
      res.redirect('/products/display-category/');
    }
  });
});

router.get('/display-category', isAdmin, function(req, res, next){
  
  Category.find({}).sort({categoryName: 1}).exec(function(error, docs){
    if(error){
      //console.log(error);
      res.send('category Error!');
    }else{
      //console.log(docs);
      var category = [];
      category.push(docs.slice(0, docs.length));
      res.render('products/admin/display-category', {title: 'display category', category:category});
    }
  });
});

router.get('/add-products',isAdmin, function(req, res, next) {
  Category.find({}).sort({categoryName: 1}).exec(function(error, docs){
    if(error){
      //console.log(error);
      res.send('category Error!');
    }else{
      //console.log(docs);
      var category = [];
      category.push(docs.slice(0, docs.length));
      res.render('products/admin/add-products', {title: 'add products', category:category});
    }
  });
});
//uploadImage.single('productImage')
router.post('/add-products',isAdmin, function(req, res, next){  
  var p_code = req.body.product_code;
  //console.log(p_code);
  Product.findOne({'code': p_code}, function(err, result){
    if(result){
      //console.log('product code already exist...!');
      //console.log(result);
      res.send('product code already exist...!');
    }
    else{
      //console.log('error');
      //consol.log(err);
      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        code: req.body.product_code,
        category: req.body.product_category,
        gender:req.body.gender,
        collection_type: req.body.collection_type,
        title: req.body.product_title,
        //description: req.body.product_description,
        price: req.body.product_price,
        //quantity:req.body.product_quantity,
        //productImage: '/images/productImages/' + req.file.filename
      });
    
      product
        .save()
        .then( result =>{
          //console.log(result);
          res.redirect('/products/add-products');
        })
        .catch(error =>{
          //console.log(error);
          res.send('Error to save Product!');
        });
    
    }
    // console.log('after if else condition....');
    // console.log(err);
    // console.log(result);
  });
  
    //console.log('successfull');
});

router.get('/admin/display-products', isAdmin,function(req, res, next){
  //console.log('admin display products');
  Product.find({}).sort({code: -1}).exec(function(err, docs){
    if(err){
      //console.log(err);
      res.send('error to find products');
    }else{
      //console.log('docs'); //console.log(docs);
      //console.log(docs[1]);
      var productChunks = [];
      var chunkSize = 4;
      for(var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      //console.log(productChunks[0][0].images[0]);
      // for(var i = 0 ; i < 2 ; i++){
      //   console.log(productChunks[0][i].images);
      //   console.log('product'); 
      // }
      res.render('products/admin/display-products', { title:' admin display all products', products: productChunks});
    }
  });
});

router.get('/display-products', function(req, res, next){
  //console.log('display-product');
  var successMsg = req.flash('success')[0];
  Product.find({}).sort({date:-1}).exec(function(err, docs){
    
    if(err){
      res.send('Error to find all products!');
    }

    var productList = [];
    var categoryList = [];
      for(var i = 0 ; i < docs.length; i++){
        var check = 1;
        for(var j = 0; j < categoryList.length; j++){
          if(docs[i].category == categoryList[j]){
            check = 0;
            break;
          }
        }
        if(check){
          
          categoryList.push(docs[i].category);

          var SingleProduct = {
            id: docs[i]._id,
            category:docs[i].category,
            img_path: docs[i].images[0].img_path
          };

          productList.push(SingleProduct);
        }
      }
      //console.log(productList);
      res.render('products/user/display-product-list',{title:'All Product List', productList: productList});
  });
});

router.get('/add-product-images/:id',isAdmin, function(req, res, next){
  var id = req.params.id;
  //console.log(id);
  Product.findOne({'_id': id}, function(err, result){
    if(err){
      //console.log('error to find data!');
    }else{
      //console.log(result);
      res.render('products/admin/add-product-images', { title: 'add products images', product: result});
    }
  });
});

router.post('/add-product-images/:id',isAdmin, uploadImage.single('color_image'), function(req, res, next){
  var id = req.params.id;
  //console.log('first');console.log(id);
  var objImages = { 
    _id: new mongoose.Types.ObjectId(),
    img_path:'/images/productImages/' + req.file.filename,
    color_code: req.body.color_code, 
    //color_quantity: req.body.color_quantity
  };
  //console.log(objImages);
  //var size = req.body.size;
  //productImage: '/images/productImages/' + req.file.filename
  Product.findOneAndUpdate({ '_id': id }, { $push:{images: objImages}},
        function (error, result) {
            if (error) {
                console.log(error);
            } else {
                //console.log('result');
                //console.log(result);
                res.redirect('/products/add-product-images/' + result._id);
            }
  });
});


router.get('/users/single-product/:id', function(req, res, next){
  var id = req.params.id;
  req.session.single_product_id = id;
  Product.findById(id).exec(function(err, docs){
    //console.log(docs);
    if(err){
      res.send('Error to find the product you want to update!');
    }else{
      //console.log(docs);
      res.render('products/user/single-product-details',{ title: 'product details', product: docs, product_id: id});
    }
  });
});

router.get('/admin/single-product/:id', isAdmin, function(req, res, next){
  var id = req.params.id;
  req.session.product_id = id;
  //console.log(id);
  //console.log(req.session.product_id);
  Product.findById(id).exec(function(err, docs){
    if(err){
      res.send('Error to find the product you want to update!');
    }else{
      //console.log(docs._id);
      res.render('products/admin/single-product-details',{ title: 'product details', product: docs});
    }
  });
});


router.get('/add-size-quantity/:color_id', isAdmin, function(req, res, next){
  var color_id = req.params.color_id;
  var id = req.session.product_id;
  //console.log('product id:' + id);
  //console.log('color code:' + color_id);
  req.session.product_id = null;
  Product.findOne({"_id": id,"images._id": color_id}, { 'images.$': 1, 'code': 1 }, function(err, result){
    if(err){
      console.log('error to find data!');
    }else{
      //console.log(result);
      res.render('products/admin/add-product-sizes-quantity', { title: 'add sizes & quantity', product: result});
    }
  });
});

router.post('/add-size-quantity/:product_id/:color_id', isAdmin, function(req, res, next){
  var color_id = req.params.color_id;
  var id = req.params.product_id;
  //console.log('product id:' + id);
  //.log('color code:' + color_id);
  
  var objSize = { 
    size: req.body.size,
    size_qty: req.body.size_quantity 
    //color_quantity: req.body.color_quantity
  };
  //console.log(objSize);
  //req.session.product_id = null;
  Product.findOneAndUpdate({"_id": id,"images._id": color_id}, { $push:{'images.$.sizes': objSize}}, function(err, result){
    if(err){
      console.log('error to add product size and quantity!');
    }else{
      //console.log(result.images);
      res.redirect('/products/admin/single-product/' + id);
    }
  });
});

router.get('/display-by-gender/:gender', function(req, res, next){
  var gender = req.params.gender;
  req.session.gender = gender;
  //console.log(gender);
  //console.log('display-by-gender');
  //var successMsg = req.flash('success')[0];
  Product.find({'gender': gender}).sort({date:-1}).exec(function(err, docs){
    if(err){
      res.send('Error to find products!');
    }else{
      var productChunks = [];
      var chunkSize = 4;
      for(var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      var categoryList = [];
      for(var i = 0 ; i < docs.length; i++){
        var check = 1;
        for(var j = 0; j < categoryList.length; j++){
          if(docs[i].category == categoryList[j]){
            check = 0;
            break;
          }
        }
        if(check){
          categoryList.push(docs[i].category);
        }
      }
      //console.log('before sort : ' + categoryList);

      for(var i = 0; i < categoryList.length ; i++){
        for(var j = i+1 ; j < categoryList.length ; j++){
          if(categoryList[i] > categoryList[j]){
            var temp = categoryList[j];
            categoryList[j] = categoryList[i];
            categoryList[i] = temp;
            j--;
          }
        }
      }

      //console.log('after sort: ' + categoryList);

      //console.log(productChunks);
      //res.send('product');
      res.render('products/display-by-gender',{products: productChunks, gender: gender, categoryList: categoryList});
    }
  });
});

router.get('/display-by-category/:gender/:category', function(req, res, next){
  var gender = req.params.gender;
  var category = req.params.category;
  //console.log(gender);
  //console.log(category);
  if(gender=="null"){
    //console.log('welcome to null: ' + gender);
    Product.find({'category': category}).sort({date:-1}).exec(function(err, docs){
      if(err){
        res.send('Error to display products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }
        var genderTypes = [];

        for(var i = 0 ; i < docs.length ; i++){
          var count = 1;
          for(var j = 0; j < genderTypes.length; j++){
            if(docs[i].gender == genderTypes[j]){
              count = 0;
              break;
            }
          }
          if(count){
            genderTypes.push(docs[i].gender);
          }
        }
        console.log('category list: ' + genderTypes);

        //console.log(productChunks);
        res.render('products/display-by-gender',{products: productChunks, gender: null,genderTypes:genderTypes});
      }
    });
  }else{
    //console.log('welcome to: ' + gender);
    Product.find({'gender': gender, 'category': category}).sort({date:-1}).exec(function(err, docs){
      if(err){
        res.send('Error to display products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }
        var categoryList = [];
        Product.find({'gender': gender}).sort({category: 1}).exec(function(err, result){
          if(err){
            console.log(err);
          }else{
            console.log('result : ' + result);
            for(var i = 0 ; i < result.length ; i++){
              var count = 1;
              for(var j = 0; j < categoryList.length; j++){
                if(result[i].category == categoryList[j]){
                  count = 0;
                  break;
                }
              }
              if(count){
                categoryList.push(result[i].category);
              }
            }
            console.log('category list: ' + categoryList);
          }
          res.render('products/display-by-gender',{products: productChunks, gender:gender, categoryList:categoryList});
        });

        //console.log(productChunks);
      }
    });
  }
});

router.get('/display-by-category/:category',function(req, res, next){
  var category = req.params.category;
  //console.log(category);

    Product.find({'category': category}).sort({code:-1}).exec(function(err, docs){
      if(err){
        res.send('Error to display products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }

        var genderTypes = [];
        for(var i = 0 ; i < docs.length ; i++){
          var count = 1;
          for(var j = 0; j < genderTypes.length; j++){
            if(docs[i].gender == genderTypes[j]){
              count = 0;
              break;
            }
          }
          if(count){
            genderTypes.push(docs[i].gender);
          }
        }
        console.log('gender list: ' + genderTypes);


        //console.log(productChunks);
        //console.log(category);
        res.render('products/display-by-category',{category: category ,products: productChunks,genderTypes:genderTypes});
      }
    });
  
});

router.get('/display-by-category-type/:gender/:category', function(req, res, next){
  var gender = req.params.gender;
  var category = req.params.category;
  //console.log(gender);
  //console.log(category);
  if(gender=="null"){
    //console.log('welcome to null: ' + gender);
    Product.find({'category': category}).sort({code:-1}).exec(function(err, docs){
      if(err){
        res.send('Error to find products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }
        //console.log(productChunks);
        res.render('products/display-by-category',{products: productChunks, category:category});
      }
    });
  }else{
    //console.log('welcome to: ' + gender);
    Product.find({'gender': gender, 'category': category}).sort({date:-1}).exec(function(err, docs){
      if(err){
        res.send('Error to display products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }
        Product.find({'category':category}).exec(function(err, result){
          if(err){
            res.send('error to find product!');
          }else{
            var genderTypes = [];
            for(var i = 0 ; i < result.length; i++){
              var check = 1;
              for(var j = 0 ; j < genderTypes.length; j++){
                if(result[i].gender == genderTypes[j]){
                  check = 0;
                  break;
                }
              }
              if(check){
                genderTypes.push(result[i].gender);
              }
            }
            res.render('products/display-by-category',{products: productChunks, category: category,genderTypes:genderTypes});
          }
        });
        //console.log(productChunks);
      }
    });
  }
});

router.get('/display-collection/:collection_type/:category', function(req, res){
  var collection_type = req.params.collection_type;
  var category = req.params.category;
  //console.log(collection_type);

  if(category == "null"){
    Product.find({'collection_type': collection_type}).sort({category: 1}).exec(function(err, docs){
      if(err){
        res.send('Error to display products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }

        var categoryList = [];
        for(var i = 0 ; i < docs.length; i++){
          var check = 1;
          for (var j = 0 ; j < categoryList.length; j++){
            if(docs[i].category == categoryList[j]){
              check = 0;
              break;
            }
          }
          if(check){
            categoryList.push(docs[i].category);
          }
        }

        //console.log('category-list: '+ categoryList);

        //console.log(productChunks);
        res.render('products/display-deals',{collection_type: collection_type ,products: productChunks, categoryList:categoryList});
      }
    });
  }else{
    Product.find({'collection_type': collection_type, 'category': category}).sort({code:-1}).exec(function(err, docs){
      //console.log('error : '+ err);
      //console.log('docs : ' + docs);
      
      if(err){
        res.send('Product have not exist in our stock or Error to display products!');
      }else{
        var productChunks = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }
        
        Product.find({'collection_type': collection_type}).sort({category: 1}).exec(function(err, result){
          if(err){
            res.send('error to find product! May be product does not exist. Try anaother one.');
          }else{
            var categoryList = [];
            for(var i = 0 ; i < result.length; i++){
              var check = 1;
              for (var j = 0 ; j < categoryList.length; j++){
                if(result[i].category == categoryList[j]){
                  check = 0;
                  break;
                }
              }
              if(check){
                categoryList.push(result[i].category);
              }
            }

            //console.log('category-list: '+ categoryList);
            res.render('products/display-deals',{products: productChunks, collection_type: collection_type,categoryList: categoryList});
          }
        });

        //console.log(productChunks);
      }
    });
  }
});

router.get('/display-to-add-slider', isAdmin, function(req, res, next){
  //console.log('admin display products to add slider');
  Product.find({}).sort({date:-1}).exec(function(err, docs){
    if(err){
      console.log(err);
      res.send('error to find products');
    }else{
      //console.log('docs'); //console.log(docs);
      //console.log(docs[1]);
      var sliderProducts = [];
      for(var i = 0 ; i < docs.length; i++){
        for(var j = 0 ; j < docs[i].images.length; j++){
          //console.log(docs[i].images[j].img_path);
          var slider = {
            category: docs[i].category,
            img_path:docs[i].images[j].img_path
          }
          sliderProducts.push(slider);
        }
      }
      //console.log(sliderProducts);
      res.render('products/admin/display-to-add-slider', { title:'display all products to add slider', sliderProducts:sliderProducts});
    }
  });
});

router.get('/display-to-add-slider/:category', isAdmin, function(req, res, next){
  var category = req.params.category;
  //console.log('admin display products to add slider');
  Product.find({'category':category}).sort({date:-1}).exec(function(err, docs){
    if(err){
      //console.log(err);
      res.send('error to find products');
    }else{
      //console.log('docs'); //console.log(docs);
      //console.log(docs[1]);
      var sliderProducts = [];
      for(var i = 0 ; i < docs.length; i++){
        for(var j = 0 ; j < docs[i].images.length; j++){
          //console.log(docs[i].images[j].img_path);
          var slider = {
            category: docs[i].category,
            img_path:docs[i].images[j].img_path
          }
          sliderProducts.push(slider);
        }
      }
      //console.log(sliderProducts);
      res.render('products/admin/display-to-add-slider', { title:'display all products to add slider', sliderProducts:sliderProducts});
    }
  });
});

router.post('/add-to-slider/', isAdmin, function(req, res, next){
  var img_path = req.body.img_path;
 Slider.findOne({'img_path': img_path}).exec(function(err,doc){
   if(doc){
     res.send('product already exist.choose another one');
   }else{
     const slider = new Slider({
       _id: new mongoose.Types.ObjectId(),
       category: req.body.category,
       img_path: req.body.img_path
     });

     slider
       .save()
       .then( result =>{
         //console.log(result);
         res.redirect('/products/display-to-add-slider');
       })
       .catch(error =>{
         //console.log(error);
         res.send('Error to save Product!');
       });
   }
 });
});

router.get('/update-products/:id',isAdmin, function(req, res, next){
  var id = req.params.id;
  //console.log('update');
  Product.findById(id).exec(function(err, docs){
    if(err){
      res.send('Error to find product the product you want to update!');
    }else{
      //console.log(docs);
      
      Category.find({}).sort({categoryName: 1}).exec(function(err, cats){
        const category = [];
        if(err){
          res.send('Error to find category list!');
        }else{
          //console.log(cats);
          
          for(var i = 0; i < cats.length; i++){
            category[i] = cats[i].categoryName;
          }
          //console.log(category);
          res.render('products/admin/update-products',{ title: 'update product', product: docs, category: category});
        }
      });
    }
  });
});

router.post('/product-code-search/', isAdmin,function(req, res){
  const code = req.body.code;
  // console.log('inside product.js file: ' + code);
  //product_code =  {$regex: new RegExp(code)}
  Product.findOne({ code: code}).exec(function(err, doc){
    if(err){
      // res.send('Error to find data!');
      // console.log(err);
      res.json(false);
    }
    else if(doc == null){
      // console.log('product: ');
      // console.log(doc);
      res.json(false);
    }else{
      res.json(true);
    }
  });
});


router.post('/update-products/:product_id',isAdmin, function(req, res, next){
  //console.log('update products');
  const id = req.params.product_id;
  const code = req.body.product_code;
  const collection_type = req.body.collection_type;
  const gender = req.body.gender_type;
  const title = req.body.product_title;
  const category = req.body.product_category;
  const price = req.body.product_price;
 
  Product.findByIdAndUpdate(id, {$set:{ code:code,collection_type: collection_type,gender:gender,title:title,category: category, price:price }},function(err, result){
    if(err){
      //console.log(err);
      res.send('Error to update data!');
    }else{
      //console.log(result);
      res.redirect('/products/admin/display-products');
    }
  });
});

router.get('/delete-products/:id',isAdmin, function(req, res, next){
  //console.log('delete products');
  var id = req.params.id;
  Product.findByIdAndRemove(id).exec(function(err, result){
    if(err){
      res.send('Failed to delete product!');
    }else{
      res.redirect('/products/admin/display-products/');
    }
  });
});

router.get('/delete-product-color/:color_id',isAdmin, function(req, res, next){
  //console.log('delete products');
  const color_id = req.params.color_id;
  const id = req.session.product_id;

  //console.log('id: '+ id);
  //console.log('color id: '+ color_id);
  
  Product.findOneAndUpdate(
    { '_id': id }, 
    { $pull:{"images":{"_id": color_id}}},
    {'new': true}
    )
  .exec(function (error, result) {
            if (error) {
                console.log(error);
            } else {
                //console.log('result');
                console.log(result);
                res.redirect('/products/admin/single-product/' + id);
            }
    })
});

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
