/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

var bcrypt = require('bcrypt')
  , hashes = require('jshashes/server/lib/hashes');

// Login form
exports.login = function(req, res) {
  res.render('users/login', { title: 'Login', error: false, redir: req.query.redir || '/' });
};

// Login handler
exports.do_login = function(req, res) {
  var no_joy = function() {
    res.render('users/login', { title: 'Login', error: true, redir: req.body.redir || '/' })
  }
  // Find the user
  models.User.find({ where: { username: req.body.username } })
  .success(function(user){
    // Validate the users password
    if (user && user.id > 0 && bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = user;
      res.redirect(req.body.redir);
    }
    // Either the user doesnt exist or the password is wrong
    else {
      no_joy();
    }
  })
  .error(function(req, res){
    no_joy();
  });
};

// Logout
exports.logout = function(req, res) {
  delete req.session.user;
  res.cookie('_bugs', '', { expires: new Date() });
  res.redirect('/');
}

// Register
exports.register = function(req, res) {
  res.render('users/register', { title: 'Register', error: false });
}

// Create
exports.create = function(req, res) {
  // Hash the password
  var salt = bcrypt.genSaltSync(10);
  var passsword_hash = bcrypt.hashSync(req.body.password, salt);

  // Build the user object
  var user = models.User.build({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    isAdmin: false,
    login_hash: new hashes.SHA1().hex("<('.'<)" + Date.now() + "<('.')>" + Math.random() + "(>'.')>")
  });
  
  // Due to Sequelize not including a proper isUnique vaidation, we have to check
  // the username is unique the old way.
  models.User.find({ where: { username: req.body.username }}).success(function(u){
    // Check for errors
    var errors = user.validate();

    // Make sure the username isnt taken
    if (u && u.username == req.body.username) {
      if (errors == null) { errors = {}; }
      errors.username = "Username is taken";
    }

    // If there are errors, display them
    if (errors) {
      res.render('users/register', { title: 'Register', error: errors });
    }
    // No errors, redirect to front page
    else {
      user.password = passsword_hash;
      user.save().success(function(){ res.redirect('/') });
    }
  });
};