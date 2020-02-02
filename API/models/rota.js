const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rotaSchema = new Schema({
    siteId:String,
    name:String,
    startDate:Number,
    finishDate:Number,
    employeeJobs : [{
        department: String,
        title: [String]
      }],
    rota:[[{time:String, rest:Boolean}]]
});

module.exports = mongoose.model('Rota',rotaSchema);