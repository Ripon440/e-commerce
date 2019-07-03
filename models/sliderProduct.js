var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sliderSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category:{type: String, required: true},
    img_path:{type: String, required: true},
});

module.exports = mongoose.model('Slider', sliderSchema);