// **** Node JS Server.
const http = require('http');

const express = require ('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./API/config/database'); 
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);

// **** Port Variables
const hostname = 'localhost';
const PORT = 3000;
const dbURI = process.env.dbUri || config.uri;
// **** API Routes
const authRoute = require('./API/routes/auth');
const adminDJRoute = require('./API/routes/adminDJ');
// const noticeboardRoute = require('./API/routes/noticeboard');
// const rotaRoute = require('./API/routes/rota');
// const fileRoute = require('./API/routes/file');
// const fileUploadRoute = require('./API/routes/fileUpload');

// **** Database Connection
mongoose.connect(dbURI, {useNewUrlParser: true}, (err) => {
    if (err){
        console.log('DataBase Connection Error :', err);
    } else {
        console.log('Successfully Connected to Database : ',dbURI);
    }
});

// **** Middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '/images')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// **** Token Decode Middleware
app.use((req, res,next)=>{
    if (!req.headers['xtoken']){
        req.decoded = {valid:false, user:null, admin:'1', message: 'No Token Supplied'};
        next();
    } else {
        let token = req.headers['xtoken'].split(' ')[1] || 'false';
        if(token !='false'){
            jwt.verify(token, config.tokenKey, function(err, decoded) {
                if(err){
                    req.decoded = {valid:false, user:null, admin:'1', message: 'User Token Error '+ err};
                    next();
                } else {
                    req.decoded = {valid:true, user:decoded.user, admin:decoded.user.admin, message: 'User token decoded'};
                    next();
                }
            })
        } else {
            req.decoded = {valid:false, user:null, admin:'1', message: 'No Token Supplied'};
            next();
        }
    }
});
// **** Router routes
app.use('/api/auth', authRoute);
app.use('/api/adminDJ', adminDJRoute);
// app.use('/api/employee', employeeRoute);
// app.use('/api/noticeboard', noticeboardRoute);
// app.use('/api/rota', rotaRoute);
// app.use('/api/file', fileRoute);
// app.use('/api/fileUpload', fileUploadRoute);

// **** Main routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// **** Start Server
server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});