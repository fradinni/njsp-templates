/**
* Basic Webapp server
*/
var path    = require('path');
var express = require('express');

var PORT          = process.env.PORT || 5000;
var PUBLIC_DIR    = path.normalize(__dirname+'/../client');
var TEMPLATES_DIR = path.normalize(PUBLIC_DIR + '/templates');

// Create new express application
var app = express();
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.cookieParser());

// Replace app.use(express.bodyParser()); to avoid connect deprecation warning
app.use(express.json());
app.use(express.urlencoded());

// Static directories
console.log(PUBLIC_DIR);
app.use(express.static(PUBLIC_DIR));

// View engine
app.set('views', TEMPLATES_DIR);
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

// Sessions
app.use(express.session({ secret: '?=LtcDashboard$%' }));

// Router
app.use(app.router);

// Home route
app.get('/', function (req, res) {
  res.render('index');
});

// Start http server
app.listen(PORT);
console.log('Server is listening on port: %d', PORT);
