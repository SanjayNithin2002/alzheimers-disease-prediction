var express = require('express');
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars").create({
    defaultLayout: "main"
});
var morgan = require("morgan");
var multer = require('multer');
var PythonShell = require('python-shell').PythonShell;
var clearDirectory = require('./middleware/clearDirectory');
var app = express();

var port = process.env.PORT || 3000;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)

    }
});

const fileFilter = (req, file, cb) => {
    //accept
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    //reject
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});
clearDirectory('./uploads/');


//Middleware
app.engine("handlebars", handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));


app.get("/", (req, res)=>{
    res.render('index');
});

app.post("/predict", upload.single('imagefile'), (req, res)=>{
    let options = {
        args: [req.file.path]
      };
      PythonShell.run('model/shell.py', options)
      .then(messages=>{
        res.render('results', {
            result : messages[messages.length-1]
        })
      });
});

app.use((req, res) => {
    res.status(404);
    res.render('notfound');
});

app.listen(port);