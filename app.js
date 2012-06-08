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
  , db = require('./db.js');

global.db = db;
global.models = require('./models');

// App
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: 'layouts/default' });
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

// Routes
app.get('/', routes.bugs.index);
app.get('/bugs/new', routes.bugs.new);
app.get('/bugs/:id', routes.bugs.view);
app.get('/login', routes.users.login);
app.post('/login', routes.users.do_login);
app.get('/register', routes.users.register);
app.post('/register', routes.users.create);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
