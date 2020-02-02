const express = require('express');
const router  = express.Router();
const SITE = require('../models/site');

router.get('/test', (req,res) =>{
    res.json({message:'from API / Site route'});
});

router.post('/findSiteCode', (req,res)=> {
    if(!req.body.siteCode){
        res.json({ success:false, message: 'No Site Code Supplied' });
    } else {
        SITE.findOne({site:req.body.siteCode}).select('_id name')
        .exec(function(err,site){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.json({ success:false, message:'Site Code Not Found' });
                } else {
                    res.json({ success:true, siteId:site._id, name:site.name });
                }
            }
        });
    }
});
// Login Site Number Checker
router.post('/checkSite', (req,res)=>{
    if(!req.body.site){
        res.json({ success:false, message: 'No Site Details Supplied' });
    } else {
        SITE.findOne({site:req.body.site}).select('name')
        .exec(function(err,site){
            if (err) {
                res.json({ success:false, message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.json({ success:false, message:'Site Code Not Found.' });
                } else {
                    res.json({ success:true, name:site.name, _id:site._id});
                }
            }
        });
    }
});
router.post('/getSiteInfo', (req,res)=>{ // open to everybody
    if(!req.body.site){
        res.json({ success:false, message: 'No Site ID Supplied' });
    } else {
        SITE.findById(req.body.site).select('name site address weekStartDay contact depotPicture welcomeDisplay employeeJobs')
        .exec(function(err,site){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.json({ success:false, message:'Site ID Not Found' });
                } else {
                    res.json({ success:true, site});
                }
            }
        });
    }
});
// Get Information For New Employee's
router.post('/getNewEmployeeInformation',(req,res)=> {
    if(!req.body.site){
        res.json({ success:false, message: 'No Site Details Supplied' });
    } else {
        SITE.findById(req.body.site).select('defaultAdminTokens employeeJobs siteOpenOn')
        .exec(function(err,site){
            if (err) {
                res.json({ success:false, message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.json({ success:false, message:'Site Code Not Found.' });
                } else {
                    res.json({ 
                        success:true,
                        employeeTypes:site.employeeJobs,
                        employeeAdmin:site.defaultAdminTokens.employee,
                        siteOpenOn:site.siteOpenOn});
                }
            }
        });
    }
})
// Get all employee Types On Site
router.post('/getEmployeeTypes', (req,res)=>{
    if(!req.body.site){
        res.json({ success:false, message: 'No Site Details Supplied' });
    } else {
        SITE.findById(req.body.site).select('employeeJobs')
        .exec(function(err,site){
            if (err) {
                res.json({ success:false, message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.json({ success:false, message:'Site Code Not Found.' });
                } else {
                    res.json({ success:true, employeeTypes:site.employeeJobs});
                }
            }
        });
    }
});
// Get Noticeboard Info
router.post('/getNoticeboardInfo', (req, res)=>{
    if (req.body.id == null || req.body.id == '') {
        res.json({ success:false, message: 'No Site ID Entered' });
    } else {
        SITE.findById(req.body.id).select('name noticeBoard')
        .exec(function(err,site){
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.json({ success:false, message:'Site ID Not Found' });
                } else {
                    res.json({ success:true, year:site.noticeBoard.years, department:site.noticeBoard.department});
                }
            }
        })
    }
});
// newWelcomeDisplay
router.post('/newWelcomeDisplay', (req,res)=>{
    if (req.body.site == null || req.body.site == '') {
        res.status(401).send({message: 'No Site ID Entered' });
    } else {
        SITE.findById(req.body.site).select('_id name welcomeDisplay')
        .exec(function(err,site){
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.status(401).json({message:'Site ID Not Found' });
                } else {
                    let w = site.welcomeDisplay.findIndex(i => i.status == 4);
                    if (w!=-1){
                        site.welcomeDisplay[w].slides.push(
                        {title:req.body.title,
                        department:req.body.department,
                        imgSrc:req.body.image.imgSrc,
                        imgAlt:req.body.image.imgAlt,
                        createdBy:{name:req.body.createdBy.name,employeeNo:req.body.createdBy.employeeNo},
                        createdDate:req.body.createdDate})
                        site.save((err)=>{
                            if (err) {
                                res.status(401).send({ message: 'DB Error : ' + err });
                            } else {
                                res.json({ success:true, message :'New Welcome Page Added.' });
                            }
                        });    
                    }
                }
            }
        })
    }
})
// update Welcome Display
router.post('/updateWelcomeDisplay',(req,res)=>{
    if (req.body.id == null || req.body.id == '') {
        res.status(401).send({message: 'No Site ID Entered' });
    } else {
        SITE.findById(req.body.id).select('_id name welcomeDisplay')
        .exec(function(err,site){
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!site){
                    res.status(401).json({message:'Site ID Not Found' });
                } else {
                    site.welcomeDisplay = [
                        {"status":4, slides:req.body.images[3]},
                        {"status":3, slides:req.body.images[2] },
                        {"status":2, slides:req.body.images[1]},
                        {"status":1, slides:req.body.images[0]}];
                    site.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Welcome Display Updated' });
                        }
                    }); 
                }
            }
        })
    }    
})
// Create New Site
router.post('/newSite',(req,res)=>{
    if (req.body.site == null || req.body.site == '') {
        res.json({ success:false, message: 'No Site Reference Entered' });
    } else if (req.body.name == null || req.body.name == '') {
        res.json({ success:false, message: 'No Site Name Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({ success:false, message: 'No Admin Password Entered' });
    } else {
        // start creating new Site entry
        var site = new SITE({
            name: req.body.name,
            site: req.body.site,
            password:req.body.password,
            address: { 
                line : req.body.address.line,
                postCode: req.body.address.postCode
            },
            weekStartDay: req.body.weekStartDay,
            siteOpenOn : req.body.siteOpenOn,
            contact: {
                name: req.body.contact.name,
                title: req.body.contact.title,
                number: req.body.contact.number,
                Email: req.body.contact.Email
            },
            depotPicture: {
                caption: req.body.depotPicture.caption,
                imgAlt: req.body.depotPicture.imgAlt,
                imgSrc: req.body.depotPicture.imgSrc,
                createdBy: req.body.depotPicture.createdBy,
                createdDate:req.body.depotPicture.createdDate,
            },
            welcomeDisplay: [
                {status: 4, slides :[{
                        title : req.body.welcomeDisplay.title,
                        department:'Management',
                        imgAlt: req.body.welcomeDisplay.imgAlt,
                        imgSrc: req.body.welcomeDisplay.imgSrc,
                        createdBy: req.body.welcomeDisplay.createdBy,
                        createdDate:req.body.welcomeDisplay.createdDate }]
                },
                { status: 3, slides :[] },
                { status: 2, slides :[] },
                { status: 1, slides :[] }
            ],
            defaultAdminTokens : {
                admin : req.body.defaultTokens.admin,
                employee : req.body.defaultTokens.employee,
                display : req.body.defaultTokens.display }
        });        
        site.employeeJobs = [];
        req.body.employeeJobs.forEach(job => {
            site.employeeJobs.push({department:job.type,title:job.title})
        });
        site.noticeBoard = {years:req.body.noticeBoard.years, department:[]}
        req.body.noticeBoard.department.forEach(dept => {
            site.noticeBoard.department.push({
                name:dept.name,
                section: dept.section
            })
        });
        site.save((err)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, message :'New Site Created ......', site: site });
            }
        });
    }
});
module.exports = router;