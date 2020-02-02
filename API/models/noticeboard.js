const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeboardSchema = new Schema({
    siteId:String,
    department:String,
    section:String,
    title:String,
    page:[{ page:Number, imgAlt: String, imgSrc: String}],
    createdBy:{name:String, employeeNo:String},
    createdDate:Number,
    latest:Number,
    archive:Number
});

module.exports = mongoose.model('Noticeboard',noticeboardSchema);