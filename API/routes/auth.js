const express = require('express');
const router  = express.Router();
const EMPLOYEE = require('../models/employee');
const SITE = require('../models/site');
const config = require('../config/database'); 
const jwt = require('jsonwebtoken');

router.get('/test', (req,res) =>{
    res.json({message:'from API / Auth route'});
});
router.get('/decodeToken', (req,res)=>{
    if (!req.decoded.valid) {
        res.json({valid:false, message: 'No Valid Token Supplied' });
    } else {
        res.json({valid:true, decoded:req.decoded.decoded});
    } 
});
// login Employee
router.post('/authenticateEmployee', (req,res)=>{
    if (req.body.number == null || req.body.number == '') {
        res.json({success:false, message: 'No Employee Number Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({success:false, message: 'No Password Entered' });
    } else {
        EMPLOYEE.findOne({number:req.body.number})
            .select('_id number name password admin site')
            .exec(function(err,employee){
                if (err) {
                    res.status(401).send({ message: 'DB Error : ' + err });
                } else {
                    if (!employee){
                        res.json({success:false, message: 'Invalid Employee Number' });
                    } else {
                        let validPassword = employee.comparePassword(req.body.password);
                        if (!validPassword){
                            res.json({success:false, message: 'Invalid Password' }); 
                        } else {
                            // create web token.  name password admin site
                            let EmployeeJson = {
                                id:employee._id,
                                number:employee.number,
                                name:employee.name,
                                admin:employee.admin,
                                site:employee.site,
                                exp:Math.floor(Date.now() / 1000) + 3600}
                            let SiteJson = {
                                id:employee.site[0].id,
                                number:'$'+employee.site[0].name,
                                name:'User : '+employee.site[0].name,
                                admin:'0',
                                site:{id:employee.site[0].id, name:employee.site[0].name},
                                exp:null
                            }  
                            let emToken = jwt.sign({employee:EmployeeJson}, config.tokenKey );
                            let siteToken = jwt.sign({site:SiteJson}, config.tokenKey);
                            res.json({
                                success:true,
                                displayScreen:false,
                                employee:employee.name,
                                employeeToken:emToken,
                                siteToken:siteToken});
                        }
                    }
                }
            }
        );
    }
});
router.post('/authenticateSite', (req,res)=>{
    if (req.body.number == null || req.body.number == '') {
        res.json({success:false, message: 'No Site Code Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({success:false, message: 'No Password Entered' });
    } else {
        let siteCode = req.body.number.substr(1);
        SITE.findOne({site:siteCode}).select('site name password defaultAdminTokens')
            .exec(function(err,site){
                if (err) {
                    res.status(401).send({ message: 'DB Error : ' + err });
                } else {
                    if (!site){
                        res.json({success:false, message: 'Invalid Site Code' });
                    } else {
                        let validPassword = site.comparePassword(req.body.password);
                        if (!validPassword){
                            res.json({success:false, message: 'Invalid Password' }); 
                        } else {
                            // create web token.
                            let EmployeeJson = {
                                id:'_Admin',
                                number:'$'+site.site,
                                name:'Admin : '+site.name,
                                admin:site.defaultAdminTokens.admin,
                                site:[{id:site._id, name:site.name}],
                                exp:Math.floor(Date.now() / 1000) + 3600}
                            let SiteJson = {
                                id:site._id,
                                number:'$'+site.site,
                                name:'Display : '+site.name,
                                admin:site.defaultAdminTokens.display,
                                site:{id:site._id, name:site.name},
                                exp:null
                            }   
                            let emToken = jwt.sign({employee:EmployeeJson}, config.tokenKey );
                            let siteToken = jwt.sign({site:SiteJson}, config.tokenKey);
                            res.json({
                                success:true,
                                displayScreen:true,
                                employee:site.name,
                                employeeToken:emToken,
                                siteToken:siteToken});
                        }
                    }
                }
            }
        );
    }
});
router.post('/authenticateDisplay', (req,res)=>{
    if (req.body.number == null || req.body.number == '') {
        res.json({success:false, message: 'No Site Code Entered' });
    } else {
        let siteCode = req.body.number.substr(1);
        SITE.findOne({site:siteCode}).select('site name password defaultAdminTokens')
            .exec(function(err,site){
                if (err) {
                    res.status(401).send({ message: 'DB Error : ' + err });
                } else {
                    if (!site){
                        res.json({success:false, message: 'Invalid Site Code' });
                    } else {
                        let SiteJson = {
                            id:site._id,
                            number:'$'+site.site,
                            name:'Display : '+site.name,
                            admin:site.defaultAdminTokens.display,
                            site:{id:site._id, name:site.name},
                            exp:null
                        }   
                        let emToken = null;
                        let siteToken = jwt.sign({site:SiteJson}, config.tokenKey);
                        res.json({
                            success:true,
                            displayScreen:true,
                            employee:site.name,
                            employeeToken:emToken,
                            siteToken:siteToken});
                    }
                }
            }
        );
    }
});
router.post('/initilizeLocalTokens', (req,res)=>{
    if(req.body.Initilize && !req.decoded.valid){
        let EmployeeJson = {
            id:'_Admin',
            number:'$000000',
            name:'Admin : 0000000',
            admin:'1000000000000000000000000000000000000000000000000000000000000011',
            site:[{id:'NoSite', name:'Initilise'}],
            exp:Math.floor(Date.now() / 1000) + 600}
        let SiteJson = {
            id:'NoSite',
            number:'$000000',
            name:'Display : 0000000',
            admin:'0000000000000000000',
            site:{id:'NoSite', name:'Initilise'},
            exp:null
        }   
        let emToken = jwt.sign({employee:EmployeeJson}, config.tokenKey );
        let siteToken = jwt.sign({site:SiteJson}, config.tokenKey);
        res.json({
            success:true,
            displayScreen:true,
            employee:'Admin Initiliser',
            employeeToken:emToken,
            siteToken:siteToken});
    } else {
        res.json({status:false, message:'Dont Do It.'})
    }
});
module.exports = router;