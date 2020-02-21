const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const djSchema = new Schema({
    number:String,
    name:String,
    password:String
});

djSchema.pre('save', function (next) {
    var DJ = this;
    console.log('Pre Save password ', DJ.password);
    if(DJ.password!==undefined){
        console.log('new Hash')
        bcrypt.hash(DJ.password, null, null, function(err, hash) {
            if(err) return next(err);
            DJ.password = hash;
            next();
        });
    } else {
        next();
    }
  });

  djSchema.methods.comparePassword = function(password){
   return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('DJ',djSchema);