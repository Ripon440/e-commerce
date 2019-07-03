var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    pickup_point: {type: String, required: true},
    contact_number: {type: Number, required: true},
    order_status:{type: String, default:'pending'},
    date:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Order', orderSchema);