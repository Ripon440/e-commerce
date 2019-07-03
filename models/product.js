var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code:{type: String, required:true},
    category:{type: String, required: true},
    gender:{type:String, required:false},
    collection_type:{type: String, required: true},
    title: {type: String, required: false},
    //description: {type: String, default: null},
    price: {type: Number, required: true},
    date:{type: Date, default: Date.now},
    //quantity:{type: Number, default: 1},
    images: [{
        _id:mongoose.Schema.Types.ObjectId,
        img_path:{type: String, required: true},
        color_code:{type:String, required: false},
        sizes:[{
            size:String,
            size_qty:{type: Number, default: 1}
        }]
        //color_quantity:{type: Number, default: 1}
    }]
});

module.exports = mongoose.model('Product', productSchema);