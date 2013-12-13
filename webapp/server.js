// NodeJS modules required
var _               = require('underscore'),
    fs              = require('fs'),
    http            = require('http'),
    request         = require('request'),
    express         = require('express'),
    passport        = require('passport'),
    MongoStore      = require('connect-mongo')(express),
    GoogleStrategy  = require('passport-google').Strategy,
    mongoose        = require('mongoose'),
    moment          = require('moment'),
    models          = require('./models.js')(mongoose),
    User            = models.User;

// Server config
var HTTP_PORT       = process.env.PORT || 5000,
    SERVER_URL      = process.env.SERVER + (process.env.NODE_ENV === 'production' ? '' : (':' + HTTP_PORT)),
    MONGOHQ_URL     = process.env.MONGOHQ_URL;

///////////////////////////////////////////////////////////////////////////////
// SERVER Code
//

// Create new express application
var app = express();

// Express configuration
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/templates');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.session({
  secret: '?=LtcDashboard$%',
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
    returnURL: SERVER_URL+'/auth/google/return',
    realm: SERVER_URL
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
// SERVER Routes
//

/**
* GET /
* HOME Route
*/
app.get('/', function (req, res) {
  if(!req.user) return res.render('index');
  else return res.redirect('/private');
});


/**
* GET /dashboard
* Dashboard Route
*/
app.get('/private', function (req, res) {
  if(!req.user) return res.redirect('/');
  return res.render('private', {user: req.user});
});




///////////////////////////////////////////////////////////////////////////////
// Starting server
//
console.log('--------------------------------------');
console.log('- Node Webapp Template Server');
console.log('--------------------------------------');
console.log('[Server] Starting...');

// Database connection
console.log('[Server] Connecting to database...');
mongoose.connect(MONGOHQ_URL, function(err) {
  if(err) {
    console.log('Error: Unable to connect to database !');
  }

  // Start HTTP listening
  http.createServer(app).listen(HTTP_PORT, function() {
    console.log('[Server] HTTP server is listening on port: ' + HTTP_PORT);
  });
});
