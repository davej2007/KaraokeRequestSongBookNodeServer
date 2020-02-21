const express = require('express');
const router  = express.Router();
const DJ = require('../models/DJ');
// const Rota = require('../models/rota');
// const config = require('../config/database');

router.get('/test', (req,res) =>{
    res.send('from API / Admin DJ route');
});

// Create New DJ
router.post('/createNewDJ', (req,res)=>{
    console.log('create new dj :',req.body)
    if (req.body.name == null || req.body.name == '') {
        res.json({success:false, message: 'No DJ Name Entered' });
    } else if (req.body.number == null || req.body.number == '') {
        res.json({success:false, message: 'No DJ Number Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({success:false, message: 'No Password Entered' });
    } else {
        var dj = new DJ({
            number:req.body.number,
            name:req.body.name,
            password:req.body.password,
            admin:req.body.admin
        });

        dj.save((err)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({success:true, message:'New DJ Created', dj});
            }
        });
    }
});

module.exports = router;