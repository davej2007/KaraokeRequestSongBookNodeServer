const express = require('express');
const router  = express.Router();
const ROTA = require('../models/rota');

router.get('/', (req,res) =>{
    res.send('from API / Rota route');
});
router.post('/findActive', (req, res)=>{  // hr 8.4
    if (req.body.site == null || req.body.site == '') {
        res.json({ success:false, message: 'No Site Reference Entered' });
    } else {
        ROTA.find({siteId:req.body.site, finishDate:null}).select('name startDate finishDate').exec((err,rotas)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, rotas : rotas });
            }
        })
    }
});
router.post('/getRotaInfo', (req, res)=>{ // hr 8.3
    if (req.body.site == null || req.body.site == '') {
        res.json({ success:false, message: 'No Site Reference Entered' });
    } else {
        ROTA.find({siteId:req.body.site})
        .select('siteId name startDate finishDate rota')
        .exec(function(err,rotas){
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!rotas){
                    res.json({ success:false, message:'Site ID Not Found' });
                } else {
                    res.json({ success:true, rotas });
                }
            }
        })
    }
});
// New Rota
router.post('/new', (req, res)=>{// hr 8.4
    // if(!req.valid || req.admin.lenght<20 || req.admin[19]=='0'){
    //     res.status(401).send({message: 'No Valid Token or Admin Rights' });
    // } else {
        if (req.body.data.site == null || req.body.data.site == '') {
            res.json({ success:false, message: 'No Site Reference Entered' });
        } else if (req.body.data.name == null || req.body.data.name == '') {
            res.json({ success:false, message: 'No Rota Name Entered' });
        } else if (req.body.data.startDate == null || req.body.data.startDate == '') {
            res.json({ success:false, message: 'No Start Date Entered' });
        } else if (req.body.rota == null || req.body.rota == '') {
            res.json({ success:false, message: 'No Rota Array Entered' });
        } else {
            var rota = new ROTA({
                siteId:req.body.data.site,
                name:req.body.data.name,
                startDate:new Date(req.body.data.startDate+' 12:00:00').valueOf(),
                finishDate:null,
                employeeJobs : {
                    department: req.body.data.jobType,
                    title: req.body.data.jobDescription
                  },
                rota:req.body.rota
            });  
            rota.save(function(err) {
                if (err) {
                    res.status(401).send({ message: 'DB Error : ' + err });
                } else {
                    res.json({ success:true, rota : rota });
                }
            });
        }
    });
// Update Rota End Date
router.post('/updateFinishDate', (req, res) => {    
    if (req.body.site == null || req.body.site == '') {
        res.json({ success:false, message: 'No Site Reference Entered' });
    } else if (req.body.name == null || req.body.name == '') {
        res.json({ success:false, message: 'No Rota Name Entered' });
    } else if (req.body.date == null || req.body.date == '') {
        res.json({ success:false, message: 'No End Date Entered' });
    } else {
        ROTA.findOne({siteId:req.body.site, name:req.body.name, finishDate:null}).select('name finishDate').exec((err,rota)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                rota.finishDate = new Date(req.body.date+' 12:00:00').valueOf();
                rota.save(function(err) {
                    if (err) {
                        res.status(401).send({ message: 'DB Error : ' + err });
                    } else {
                        res.json({ success:true,  rota : rota });
                    }
                });
            }
        });
    }
});

module.exports = router;