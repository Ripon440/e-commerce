var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Product = require('../models/product');
var Test = require('../models/test');
var Category = require('../models/categories');
var multer = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/test/');
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
        fileSize: 1024 * 1024 * 50
    },
    fileFilter:fileFilter
});


router.use(bodyParser.urlencoded({
    extended: true
}));


router.get('/add-user', function(req, res, next){
    res.render('test/add-user');
});

router.post('/add-user', function(req, res) {
    Test.create({
      UserID: req.body.userid,
      User_Info: req.body.userinfo,
      First_Name: req.body.firstname,
      Last_Name: req.body.lastname,
      Current_Address: req.body.currentaddress,
      Email_Address: req.body.emailaddress,
      Phone_Numbers: req.body.phonenumbers,
      Home_Phone: req.body.homephone,
      Work_Phone: req.body.workphone,
      Cell_Phone: req.body.cellphone,
      Phone_Verified:
      req.body.phoneverified,
      Home: req.body.home,
      Work: req.body.work,
      Cell: req.body.cell,
    }).then(user => {
      console.log(user);
      res.json(user);
    }).catch(err => {
        console.log(err);
    });
});
 
/* GET home page. */
router.get('/add-products-colors', function(req, res, next) {
    console.log('add-products-color');
    res.render('test/add-products-colors', {title: 'add products colors', var1 : "apple", var2: "apple"});
});

router.post('/add-single-image',uploadImage.single('singleImage'), function(req, res, next) {
    console.log('single image'); 
    //console.log(req.file);   

    const test = new Test({
        _id: new mongoose.Types.ObjectId,
        images:[{
            color:'green',
            sizes:[{
                size:'M',
                quantity:22
            }]
        }]
    });

    test
        .save()
        .then(result =>{
            console.log('successfully saved test..');
            console.log(result);
        })
        .catch(error =>{
            console.log('error to save test..');
            console.log(error);
        })
    //console.log(test);
    //res.render('practice/add-products-colors', {title: 'add products colors'});
});

router.get('/insert-data', function(req, res, next) {
    console.log('insert data'); 
    //console.log(req.file);   
    const test = new Test({
        _id: new mongoose.Types.ObjectId,
        name:{
            first: 'Ripon3',
            last:'Ali'
        },
    });
    test
        .save()
        .then(result =>{
            console.log('successfully saved test..');
            console.log(result);
        })
        .catch(error =>{
            console.log('error to save test..');
            console.log(error);
        })
    res.redirect('/test/add-products-colors');
    //console.log(test);
    //res.render('practice/add-products-colors', {title: 'add products colors'});
});

router.get('/findData', function(req, res){
    Test.findOne({'name.first':'Ripon3'})
    .select({})
    .exec(function(err, docs){
        if(err){
            console.log('error to find test data...');
            console.log(error);
        }else{
            console.log('Success to find data...');
            //var test = new Test();
            //test.images.push('ee');
            console.log(docs.products[0].p_name);
            //res.redirect('/test/add-products-colors');
        }
    });
});

router.get('/updateData', function(req, res){
    var objFriends = { p_name:"dal",p_price: 22};
    var arr = "bb";
    Test.findOneAndUpdate({ 'name.first': 'Ripon3' }, { $push: { images: arr, products: objFriends } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                res.redirect('/test/add-products-colors');
            }
    });

    // Test.find({}, function(err, docs){
    //     if(err){
    //         console.log('error to find test data...');
    //         console.log(error);
    //     }else{
    //         console.log('Success to find data...');
    //         console.log(docs);
    //         res.redirect('/test/add-products-colors');
    //     }
    // });
});

router.get('/removeData', function(req, res, next){
    Test.remove({}).exec(function(err, result){
        if(err){
            console.log(err);
        }else{
            console.log('successfully removed all data from Test Model.');
            res.redirect('/test/add-products-colors');
        }
    });    
});

router.post('/add-multiple-images', uploadImage.array('multipleImage',3), function(req, res, next) {
    console.log('multiple images');   
    console.log(req.files); 
    //res.render('practice/add-products-colors', {title: 'add products colors'});
});


router.get('/test/:first/:second', function(req, res, next){
    var a = req.params.first;
    var b = req.params.second;
    console.log(a);
    console.log(b);
});

module.exports = router;