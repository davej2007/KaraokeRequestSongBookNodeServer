const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    number:String,
    name:String,
    email:String,
    password:String,
    resetPassword:Boolean,
    admin:String,
    employeeJobType:String,
    employeeJob:String,
    site:[{id:String, name:String}],
    startEmploymentDate:Number,
    rota:[{
        rota:{type: mongoose.Schema.Types.ObjectId, ref:'Rota'},
        startDate:Number,
        finishDate:Number,
        startLine:Number
    }],
    rotaComments:[{
        startDate:Number,
        finishDate:Number,
        code:String,
        comment:String
    }],
    holidays:[{
        startDate:Number,
        finishDate:Number
    }],
    startTimes:[{
        date:Number,
        time:String
    }],
    gdprReset:Number
});

employeeSchema.pre('save', function (next) {
    var employee = this;
    console.log('Pre Save password ', employee.password);
    if(employee.password!==undefined){
        console.log('new Hash')
        bcrypt.hash(employee.password, null, null, function(err, hash) {
            if(err) return next(err);
            employee.password = hash;
            next();
        });
    } else {
        next();
    }
  });

  employeeSchema.methods.comparePassword = function(password){
   return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Employee',employeeSchema);