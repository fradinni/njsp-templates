/**
* Basic Webapp server
*/
var path            = require('path');
var express         = require('express');
var passport        = require('passport');
var GoogleStrategy  = require('passport-google').Strategy;
var MongoStore      = require('connect-mongo')(express);
var mongoose        = require('mongoose');
var models          = require('./models/models.js')(mongoose);
var User            = models.User;

var PORT          = process.env.PORT || 5000;
var PUBLIC_DIR    = path.normalize(__dirname+'/../client');
var TEMPLATES_DIR = path.normalize(PUBLIC_DIR + '/templates');
var MONGOHQ_URL   = process.env.MONGOHQ_URL;

// Create new express application
var app = express();
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.cookieParser());

// Replace app.use(express.bodyParser()); to avoid connect deprecation warning
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(PUBLIC_DIR));
app.set('views', TEMPLATES_DIR);
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.use(express.session({
  secret: '?=MySecret$%',
  store: new MongoStore({
    url: MONGOHQ_URL
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

///////////////////////////////////////////////////////////////////////////////
// Passport configuration
//
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    returnURL: process.env.SERVER_URL+'/auth/google/return',
    realm: process.env.SERVER_URL
  },
  function(identifier, userInfos, done) {
    User.findOne({ email: userInfos.emails[0].value }, function (err, user) {
      if(!err) {
        if(!user) {
          user = new User({
            openId: identifier,
            infos: userInfos,
            email: userInfos.emails[0].value
          });
          user.save(function(err) {
            return done(err, user);
          });
        }
      }
      return done(err, user);
    });
  }
));



///////////////////////////////////////////////////////////////////////////////
// Authentication Routes
//

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
  res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



///////////////////////////////////////////////////////////////////////////////
// APPLICATION Routes
//
app.get('/', function (req, res) {
  res.render('index');
});

// Start http server
// app.listen(PORT);
// console.log('Server is listening on port: %d', PORT);

///////////////////////////////////////////////////////////////////////////////
// Starting server
//
console.log('--------------------------------------');
console.log('- Node Webapp Template Server');
console.log('--------------------------------------');
console.log('[Server] Starting...');

// Database connection
console.log('[Server] Connecting to database...');
if(MONGOHQ_URL) {
  mongoose.connect(MONGOHQ_URL, function(err) {
    if(err) {
      console.log('Error: Unable to connect to database !');
    }

    // Start HTTP listening
    app.listen(PORT, function() {
      console.log('[Server] HTTP server is listening on port: ' + PORT);
    });
  });
} else {
  // Start HTTP listening
  app.listen(PORT, function() {
    console.log('[Server] HTTP server is listening on port: ' + PORT);
  });
}

