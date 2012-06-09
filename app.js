/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

var express = require('express')
  , routes = require('./routes')
  , db = require('./db.js')
  , config = require('./config.js');

global.db = db;
global.models = require('./models');

// App
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.secret, reapInterval: 60000 * 10 }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: 'layouts/default', app: { title: config.title } });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  db.sync();
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Helpers
app.dynamicHelpers({
  session: function(req, res){
    return req.session
  }
});

// Middlewares
function getCurrentUser(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    models.User.find({ where: { login_hash: req.cookies._bugs }}).success(function(user){
      req.session.user = user;
      next();
    });
  }
}

function requiresLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login?goto=' + req.url);
  }
}

// Routes
app.get('/', getCurrentUser, routes.bugs.index);
app.get('/bugs/new', [getCurrentUser, requiresLogin], routes.bugs.new);
app.post('/bugs/new', [getCurrentUser, requiresLogin], routes.bugs.create);
app.get('/bugs/:id', getCurrentUser, routes.bugs.view);
app.get('/login', getCurrentUser, routes.users.login);
app.post('/login', getCurrentUser, routes.users.do_login);
app.get('/logout', routes.users.logout);
app.get('/register', getCurrentUser, routes.users.register);
app.post('/register', getCurrentUser, routes.users.create);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
