var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    categoryName: {type: String, required: true}
});

module.exports = mongoose.model('Category', categorySchema);