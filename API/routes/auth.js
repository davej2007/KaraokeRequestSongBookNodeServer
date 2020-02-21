const express = require('express');
const router  = express.Router();
// const EMPLOYEE = require('../models/employee');
const config = require('../config/database'); 
const jwt = require('jsonwebtoken');

router.get('/test', (req,res) =>{
    res.json({message:'from API / Auth route'});
});
router.get('/decodeToken', (req,res)=>{
    console.log('decode called', req.decoded);
    console.log('body :', req.body)
    if (!req.decoded.valid) {
        res.json({success:false, admin:req.decoded.admin, message: 'No Valid Token Supplied' });
    } else {
        res.json({success:true, admin:req.decoded.admin, user:req.decoded.user});
    } 
});

router.post('/initilizeLocalToken', (req,res)=>{
    console.log('req.body.Initilize', req.body.Initilize)
    if(req.body.Initilize && !req.decoded.valid){
        let UserJSON = {
            id:'_Admin',
            name:'Admin : 0000000',
            admin:'1111111',
            exp:Math.floor(Date.now() / 1000) + 600}
           
        let userToken = jwt.sign({user:UserJSON}, config.tokenKey );
        res.json({
            success:true,
            user:UserJSON,
            userToken:userToken});
    } else {
        res.json({status:false, message:'Dont Do It.'})
    }
});
module.exports = router;