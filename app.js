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
  , config = require('./config.js')
  , bugsjs = require('./package.json');

global.db = db;
global.models = require('./models');

// App
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.secret, key: '_sess', cookie: { httpOnly: true, maxAge: 10 * 100000000 } }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: 'layouts/default', app: { title: config.title, ver: bugsjs.version } });
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
    return req.session;
  },
  requestedUrl: function(req, res){
    return req.url;
  }
});

// Middlewares
function requiresLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login?redir=' + req.url);
  }
}

function adminOnly(req, res, next) {
  if (req.session.user.isAdmin) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', routes.bugs.index);
app.get('/bugs/new', [requiresLogin], routes.bugs.new);
app.post('/bugs/new', [requiresLogin], routes.bugs.create);
app.get('/bugs/:id', routes.bugs.view);
app.post('/bugs/:id/update', [requiresLogin, adminOnly], routes.bugs.update_status);
app.get('/login', routes.users.login);
app.post('/login', routes.users.do_login);
app.get('/logout', routes.users.logout);
app.get('/register', routes.users.register);
app.post('/register', routes.users.create);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
