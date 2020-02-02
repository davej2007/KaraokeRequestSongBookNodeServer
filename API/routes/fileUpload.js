const express = require('express');
const router  = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uri = './images';

router.get('/test', (req,res) =>{
    res.json({message:'from API / fileUpload route'});
});


// Multer File Upload Routes
router.get('/upload', (req, res)=>{
    res.end('file catcher example');
  });
     
  let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uri+'/uploads');
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
      }
  });

  let uploadInitImage = multer({storage: storage});
  router.post('/uploadPhotoImage',uploadInitImage.single('photo'), (req, res)=>{
    if (!req.file) {
      return res.json({ success: false, message: "No file received", error:err });
    } else {
      return res.json({ success: true, originalname:req.file.originalname, uploadname:req.file.filename})
    }
  });

  let uploadNoticeBoardImage = multer({storage: storage});
  router.post('/uploadNoticeboardImage',uploadNoticeBoardImage.single('noticeboard'), (req, res)=>{
    if (!req.file) {
      return res.json({ success: false, message: "No file received", error:err });
    } else {
      return res.json({ success: true, originalname:req.file.originalname, uploadname:req.file.filename})
    }
  });
  
  let uploadWelcomeDisplayImage = multer({storage: storage});
  router.post('/uploadWelcomeDisplayImage',uploadWelcomeDisplayImage.single('welcomeDisplay'), (req, res)=>{
    if (!req.file) {
      return res.json({ success: false, message: "No file received", error:err });
    } else {
      return res.json({ success: true, originalname:req.file.originalname, uploadname:req.file.filename})
    }
  });
  
  let uploadStartTimesCSV = multer({storage: storage});
  router.post('/uploadStartTimesCSV',uploadStartTimesCSV.single('startTimes'), (req, res)=>{
    if (!req.file) {
      return res.json({ success: false, message: "No file received", error:err });
    } else {
      return res.json({ success: true, originalname:req.file.originalname, uploadname:req.file.filename})
    }
  });
module.exports = router;