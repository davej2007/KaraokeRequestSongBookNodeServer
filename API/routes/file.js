const express = require('express');
const router  = express.Router();
const fs = require('fs');
const xlsx = require('xlsx');

const uri = './images';

router.get('/test', (req,res) =>{
    res.json({message:'from API / File route', files:AllFilesUploaded});
});
router.post('/newSiteDirectory', (req,res)=>{
  if (req.body.id == null || req.body.id == '') {
    res.json({ success:false, message: 'No Site ID Reference Entered' });
  } else {
    fs.mkdir(uri+'/depots/'+req.body.id, (err)=>{
      if(err){
        res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id });
      } else {
        fs.mkdir(uri+'/depots/'+req.body.id+'/welcomeDisplay', (err)=>{
          if(err){
            res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id+'/welcomeDisplay' });
          } else {
            fs.mkdir(uri+'/depots/'+req.body.id+'/noticeBoard', (err)=>{
              if(err){
                res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id+'/noticeBoard' });
              } else {
                fs.mkdir(uri+'/depots/'+req.body.id+'/noticeBoard/Management', (err)=>{
                  if(err){
                    res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id+'/noticeBoard/management' });
                  } else {
                    fs.mkdir(uri+'/depots/'+req.body.id+'/noticeBoard/Engagement', (err)=>{
                      if(err){
                        res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id+'/noticeBoard/engagement' });
                      } else {
                        fs.mkdir(uri+'/depots/'+req.body.id+'/noticeBoard/Union', (err)=>{
                          if(err){
                            res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id+'/noticeBoard/union' });
                          } else {
                            fs.mkdir(uri+'/depots/'+req.body.id+'/noticeBoard/Health & Safety', (err)=>{
                              if(err){
                                res.json({ success:false, message :'Cannot Create Directory : /depots/'+req.body.id+'/noticeBoard/healthSafety' });
                              } else {
                                res.json({ success:true, message :'New Site Directory Created   ......' });
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
});
router.post('/moveImageFiles', (req,res)=>{
  if (req.body.id == null || req.body.id == '') {
    res.json({ success:false, message: 'No Site ID Reference Entered.' });
  } else if (req.body.depot == null || req.body.depot == '') {
    res.json({ success:false, message: 'No Depot Image Entered.' });
  } else if (req.body.welcome == null || req.body.welcome == '') {
    res.json({ success:false, message: 'No Welcome Display Image Entered.' });
  } else {
    fs.rename(uri+'/uploads/'+req.body.depot, uri+'/depots/'+req.body.id+'/'+req.body.depot, (err) => {
      if (err) {
        res.json({ success:false, message: 'Cannot Rename Depot Image' });
      } else {
        fs.rename(uri+'/uploads/'+req.body.welcome, uri+'/depots/'+req.body.id+'/welcomeDisplay/'+req.body.welcome, (err) => {
          if (err) {
            res.json({ success:false, message: 'Cannot Rename Welcome Display Image' });
          } else {
            res.json({ success:true, message: 'Image Files Saved.' });
          }
        });
      }
    });
  }
});
router.post('/deleteUploadsFiles', (req,res)=> {
  if (req.body.img == null || req.body.img == '') {
    res.json({ success:false, message: 'No Image File Name Entered.' });
  } else {
  fs.unlink(uri+'/uploads/'+req.body.img, (err) => {
    if (err) {
      res.json({ success:false, message: 'Cannot Delete Image' });
    } else {
      res.json({ success:true, message: 'Image Files Deleted.' });
    }
  });
  }
});
router.post('/deleteWelcomeDisplayFiles', (req,res)=> {
  if (req.body.id == null || req.body.id == '') {
    res.json({ success:false, message: 'No Site ID Entered.' });
  } else if (req.body.img == null || req.body.img == '') {
    res.json({ success:false, message: 'No Image File Name Entered.' });
  } else {
    fs.unlink(uri+'/depots/'+req.body.id+'/welcomeDisplay/'+req.body.img, (err) => {
      if (err) {
        res.json({ success:false, message: 'Cannot Delete Image' });
      } else {
        res.json({ success:true, message: 'Image Files Deleted.' });
      }
    });
  }
})
router.post('/moveFile',(req,res)=> {
  if (req.body.oldDir == null || req.body.oldDir == '') {
    res.json({ success:false, message: 'No Old Directory Entered.' });
  } else if (req.body.newDir == null || req.body.newDir == '') {
    res.json({ success:false, message: 'No New Directory Entered.' });
  } else if (req.body.filename == null || req.body.filename == '') {
    res.json({ success:false, message: 'No File Name Entered.' });
  } else {
    let oldfile = uri+'/'+req.body.oldDir+'/'+req.body.filename;
    let newfile = uri+'/'+req.body.newDir+'/'+req.body.filename;
    fs.rename(oldfile, newfile, (err) => {
      if (err) {
        res.json({ success:false, message: 'Cannot Rename '+ req.body.filename });
      } else {
        res.json({ success:true, message: 'Rename '+ req.body.filename });
      }
    })
  }
});

// start time decode
router.post('/decodedStartTimesCSV', (req,res)=>{
  var output = [];
  var filename = "./images/uploads/startTimesUpload.xlsx" || uri + '/uploads/' + req.body.filename
  
  console.log('decode csv', filename)
  var wb = xlsx.readFile(filename, {raw:'w'});
  console.log(wb.SheetNames)
  var ws = wb.Sheets[wb.SheetNames];
  console.log(ws)
  var data = xlsx.utils.sheet_to_json(ws)
  console.log(data);
  res.json(data);
});
module.exports = router;


