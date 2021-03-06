var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    //_id: {type: String, required: true},
    //fullname: {type: String, required: true},
    //username: {type: String, required: true},
    email: {type: String, required: true},
    //contactnumber: {type: String, required: true},
    password: {type: String, required: true},
    admin:{type:Boolean, default: false}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);