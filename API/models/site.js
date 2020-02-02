const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const siteSchema = new Schema({
    name: String,
    site: { type: String, uppercase: true },
    password:String,
    address: { 
        line : [String],
        postCode: String
    },
    weekStartDay: Number,
    siteOpenOn : Number,
    contact: {
        name: String,
        title: String,
        number: String,
        Email: String
    },
    depotPicture: {
        caption: String,
        imgAlt: String,
        imgSrc: String,
        createdBy:{name:String, employeeNo:String},
        createdDate:Number,
    },
    welcomeDisplay: [
        {status:Number,
        slides:[{
            title : String,
            imgAlt: String,
            imgSrc: String,
            department:String,
            createdBy:{name:String, employeeNo:String},
            createdDate:Number,
        }]
    }],        
    employeeJobs : [{
          department: String,
          title: [String]
        }],
    noticeBoard: {
        years: [ Number ],
        department: [{
            name: String,
            section: [String]
        }]
    },
    defaultAdminTokens : {
        admin : String,
        employee : String,
        display : String }
});

siteSchema.pre('save', function (next) {
    var site = this;
    bcrypt.hash(site.password, null, null, function(err, hash) {
        if(err) return next(err);
        site.password = hash;
        next();
    });
  });

  siteSchema.methods.comparePassword = function(password){
   return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Site',siteSchema);