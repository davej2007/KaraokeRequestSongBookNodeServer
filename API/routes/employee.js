const express = require('express');
const router  = express.Router();
const Employee = require('../models/employee');
const Rota = require('../models/rota');
const config = require('../config/database');

router.get('/test', (req,res) =>{
    res.send('from API / Employee route');
});
// New Employee Number Email Checkers
router.post('/checkLogin', (req,res)=>{
    if(!req.body.number){
        res.json({ success:false, message: 'No Employee Number Supplied' });
    } else {
        Employee.findOne({number:req.body.number}).select('name')
        .exec(function(err,employee){
            if (err) {
                res.json({ success:false, message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({ success:false, message:'Employee Number Not Found.' });
                } else {
                    res.json({ success:true, name:employee.name, _id:employee._id});
                }
            }
        });
    }
});
router.post('/checkNumber', (req,res)=>{ // hr 8.4
    if(!req.body.number){
        res.json({ valid:false,message:'No Employee Number Supplied' });
    } else {
        Employee.findOne({number:req.body.number}).select('number').exec((err,employee)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!!employee){
                    res.json({ valid:false,message:'Employee Number Already Entered' });
                } else {
                    res.json({ valid:true, message:  'OK'});
                }
            }
        });
    }
});
router.post('/checkEmail', (req,res)=>{ // hr 8.4
    if(!req.body.email){
        res.json({ valid:false,message: 'No Employee Email Supplied' });
    } else {
        Employee.findOne({email:req.body.email}).select('number name').exec((err,employee)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!!employee){
                    res.json({ valid:false,number:employee.number, message: 'Employee Email Already Entered' });
                } else {
                    res.json({ valid:true, message: 'ok'});
                }
            }
        });
    }
});
// Get Employee Info
router.post('/getEmployeeInfo', (req,res)=>{
    if (req.body.id == null || req.body.id == '') {
        res.status(401).send({message: 'No Employee ID Entered' });
    } else {
        Employee.findById(req.body.id).populate('rota.rota').exec((err,employee)=>{
            if (err) {
                res.status(401).send({message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.status(401).send({message: 'Employee ID Not Found.' });
                } else {
                    res.json(employee);
                }
            }
        });
    }
});
// Holidays
router.post('/findNumber', (req,res)=>{ // supervisor 6.2
    if (req.body.number == null || req.body.number == '') {
        res.json({success: false, message: 'No Employee Number Entered' });
    } else if (req.body.site == null || req.body.site == '') {
        res.json({success: false, message: 'No Site Id Entered' });
    } else {
        Employee.findOne({number:req.body.number}).select('_id number name site startTimes' ).exec((err,employee)=>{
            if (err) {
                res.json({success: false, message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({success: false, message:'Employee Number Does Not Exist' });
                } else {
                    if(employee.site[0].id!=req.body.site){
                        res.json({success: false, message:'Employee Site Does Not Match' });  
                    } else {
                        res.json({success: true, employee});
                    }
                }
            }
        });
    }
});
// Update Password
router.post('/checkPassword', (req,res)=>{ // Employee 5.2
    if (req.body.id == null || req.body.numberid == '') {
        res.json({ valid:false, message: 'No Employee ID Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({ valid:false, message: 'No Password Entered' });
    } else {
        Employee.findById(req.body.id).select('_id password').exec((err,employee)=>{
            if (err) {
                res.json({ valid:false, message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({ valid:false, message: 'Invalid Employee ID' });
                } else {
                    let validPassword = employee.comparePassword(req.body.password);
                    if (!validPassword){
                        res.json({ valid:false, message: 'Invalid Password' }); 
                    } else {
                        res.json({ valid:true, message: 'Password OK' }); 
                    }
                }
            }
        });
    }
});
router.post('/updatePassword', (req,res)=>{ // Employee 5.2
    if (req.body.id == null || req.body.numberid == '') {
        res.json({ valid:false, message: 'No Employee ID Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({ valid:false, message: 'No Password Entered' });
    } else {
        Employee.findById(req.body.id).select('_id password').exec((err,employee)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({ valid:false, message: 'Invalid Employee ID' });
                } else {
                    employee.password = req.body.password; // password updated.
                    employee.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ valid:true, message: 'Password Updated.' });
                        }
                    });
                }
            }
        });
    }
});

// Update Employee
router.post('/updateEmployee', (req,res)=>{
    if (req.body.id == null || req.body.id == '') {
        res.status(401).send({message: 'No Employee ID Reference Entered' });
    } else {
        Employee.findById(req.body.id)
        .populate('rota.rota')
        .select('_id rota admin employeeJobType employeeJob site')
        .exec((err,employee)=>{
            if (err) {
                res.status(401).send({message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.status(401).send({message: 'Employee ID Not Found.' });
                } else {
                    employee.admin = req.body.admin; // update admin
                    employee.employeeJobType = req.body.employeeJobType;
                    employee.employeeJob = req.body.employeeJob; // update employee job
                    if(req.body.newSite){
                        console.log('update Site', req.body.siteName, req.body.siteId);
                    }
                    if(req.body.newRota){
                        let index = employee.rota.findIndex(i => i.finishDate === null);
                        if (index!=-1) employee.rota[index].finishDate = req.body.startDate;
                        Rota.findById(req.body.rota).exec((err,rota)=>{
                            if (err) {
                                res.status(401).json({message: 'DB Error : ' + err });
                            } else {
                                if (!rota){
                                    res.status(401).json({message:'Rota ID Not Found' });
                                } else {
                                   employee.rota.push({
                                       rota:rota,
                                       startDate:req.body.startDate,
                                       finishDate:null,
                                       startLine:req.body.startLine - 1
                                    });
                                    employee.save((err)=>{
                                        if (err) {
                                            res.status(401).send({ message: 'DB Error : ' + err });
                                        } else {
                                            res.json({ success:true, message:'Employee Updated ', employee });
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        employee.save((err)=>{
                            if (err) {
                                res.status(401).send({ message: 'DB Error : ' + err });
                            } else {
                                res.json({ success:true, message:'Employee Updated ', employee });
                            }
                        });
                    }
                }
            }
        })
    }
})
// Create New Employee
router.post('/newEmployee', (req,res)=>{ // hr 8.4
    if (req.body.site == null || req.body.site == '') {
        res.status(401).send({message: 'No Site Reference Entered' });
    } else if (req.body.name == null || req.body.name == '') {
        res.status(401).send({message: 'No Name Entered' });
    } else if (req.body.number == null || req.body.number == '') {
        res.status(401).send({message: 'No Employee Number Entered' });
    } else if (req.body.email == null || req.body.email == '') {
        res.status(401).send({message: 'No Employee Email Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.status(401).send({message: 'No Password Entered' });
    } else {
        var employee = new Employee({
            number:req.body.number,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            resetPassword:true,
            admin:req.body.admin,
            employeeJobType:req.body.employeeJobType,
            employeeJob:req.body.employeeJob,
            startEmploymentDate:req.body.startEmDate,
            site:[{id:req.body.site, name:req.body.siteName}],
            holidays:[],
            startTimes:[],
            rotaComments:[],
            gdprReset:0
        });
        Rota.findById(req.body.rotaId).exec((err,rota)=>{
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!rota){
                    res.status(401).json({message:'Rota ID Not Found' });
                } else {
                   employee.rota.push({
                       rota:rota,
                       startDate:req.body.startDate,
                       finishDate:null,
                       startLine:req.body.startLine
                    });
                    employee.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ employee: employee });
                        }
                    });
                }
            }
        });
    }
});
// ******* 401 routes *******

// Holidays
router.post('/getEmployeeHolidays', (req,res)=>{ // supervisor 6.2
    if (req.body.employee == null || req.body.employee == '') {
        res.json({success:false, message: 'No Employee Id Entered' });
    } else {
        Employee.findById(req.body.employee).select('number name holidays').exec((err,employee)=>{
            if (err) {
                res.status(401).send({message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({success:false, message: 'Employee Number Not Found.' });
                } else {
                    res.json({success:true, employee});
                }
            }
        });
    }
});
router.post('/saveEmployeeHolidays', (req,res)=>{ // supervisor 6.2
    if (req.body.id == null || req.body.id == '') {
        res.json({success:false, message: 'No Employee Id Entered' });
    } else {
        Employee.findById(req.body.id).select('number name holidays').exec((err,employee)=>{
            if (err) {
                res.status(401).send({message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({success:false, message: 'Employee Number Not Found.' });
                } else {
                    employee.holidays = req.body.holidays;
                    employee.save((err)=>{
                        if (err) {
                            res.status(401).send({message: 'DB Error on Save: ' + err });
                        } else {
                            res.json({success:true, employee});
                        }
                    })
                }
            }
        });
    }
});
// start Times
router.post('/saveEmployeeStartTime', (req,res)=>{
    if (req.body.id == null || req.body.id == '') {
        res.json({success:false, message: 'No Employee Id Entered' });
    } else {
        Employee.findById(req.body.id).select('_id startTimes').exec((err,employee)=>{
            if (err) {
                res.status(401).send({message: 'DB Error : ' + err });
            } else {
                if (!employee){
                    res.json({success:false, message: 'Employee Not Found.'});
                } else {
                    let index = employee.startTimes.findIndex(i => i.date == req.body.date)
                    if (index == -1 ) {
                        employee.startTimes.push({ date:req.body.date, time:req.body.time });
                    } else {
                        employee.startTimes[index].time = req.body.time;
                    }                    
                    employee.save((err)=>{
                        if (err) {
                            res.status(401).send({message: 'DB Error on Save: ' + err });
                        } else {
                            res.json({success:true , message:'Updated'});
                        }
                    })
                }
            }
        });
    }
});
module.exports = router;