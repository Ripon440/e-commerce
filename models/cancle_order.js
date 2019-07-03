var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cancleOrderSchema = new Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    user_email: {type: String, required: true},
    order_id: {type: String, required: true},
    date:{type: Date, default: Date.now}
});

module.exports = mongoose.model('CancleOrder', cancleOrderSchema);