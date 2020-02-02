const express = require('express');
const router  = express.Router();
const Noticeboard = require('../models/noticeboard');

router.get('/', (req,res) =>{
    console.log('request decoded :',req.valid)
    console.log('admin variable : ', req.admin);
    console.log('Req.decoded : ', req.decoded)
    res.send('from API / Noticeboard route');
});

// New NoticeBoard
router.post('/new', (req,res)=>{  // Manager 6.1
    // console.log('Valid Token :',req.valid)
    // console.log('admin variable : ', req.admin);
    // if(!req.valid || req.admin.lenght<20 || req.admin[19]=='0'){
    //     res.status(401).send({message: 'No Valid Token or Admin Rights' });
    // } else {
        if (req.body.site == null || req.body.site == '') {
            res.json({success:false, message: 'No Site Reference Entered' });
        } else if (req.body.department == null || req.body.department == '') {
            res.json({success:false, message: 'No Department Name Entered' });
        } else if (req.body.section == null || req.body.section == '') {
            res.json({success:false, message: 'No Section Entered' });
        } else if (req.body.title == null || req.body.title == '') {
            res.json({success:false, message: 'No Title Entered' });
        } else {
            var noticeBoard = new Noticeboard({
                siteId:req.body.site,
                department:req.body.department,
                section:req.body.section,
                title:req.body.title,
                page:req.body.page,
                createdBy:req.body.createdBy,
                createdDate:req.body.createdate,
                latest:req.body.latest,
                archive:req.body.archive
            });  
            noticeBoard.save(function(err) {
                if (err) {
                    res.status(401).json({message: 'DB Error : ' + err });
                }
                else {
                    res.json({success:true, noticeBoard : noticeBoard });
                }
            });
        }
    // }
});
// Get Noticeboard Title List For Site & Department
router.post('/getTitleList', (req, res)=>{
    if (req.body.site == null || req.body.site == '') {
        res.json({success:false, message: 'No Site Reference Entered' });
    } else if (req.body.department == null || req.body.department == '') {
        res.json({success:false, message: 'No Department Name Entered' });
    } else {
        console.log(req.body.site, req.body.department);
        Noticeboard.find({siteId:req.body.site, department:req.body.department}).select('site department section title createdDate latest archive')
        .exec(function(err,notices){
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!notices){
                    res.json({success:false, message:'Site ID Not Found' });
                } else {
                    console.log(notices)
                    res.json({success:true, notices});
                }
            }
        })
    }
});
// Get notice details by ID
router.post('/getNotice', (req, res)=>{
    if (req.body.id == null || req.body.id == '') {
        res.json({success:false, message: 'No Notice ID Entered' });
    } else {
        console.log('get notice ', req.body.id)
        Noticeboard.findById(req.body.id)
        .select('siteId department section title page createdBy createdDate latest archive')
        .exec(function(err,notice){
            if (err) {
                res.status(401).json({message: 'DB Error : ' + err });
            } else {
                if (!notice){
                    res.json({success:false,message:'No Notice Found' });
                } else {
                    res.json({success:true,notice});
                }
            }
        })
    }
});
module.exports = router;