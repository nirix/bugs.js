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
  res.render('users/login', { title: 'Login', error: false });
};

// Login handler
exports.do_login = function(req, res) {
  // Find the user
  models.User.find({ where: { username: req.body.username } })
  .success(function(user){
    // Validate the users password
    if (user.id > 0 && bcrypt.compareSync(req.body.password, user.password)) {
      res.cookie('_bugs', user.login_hash, { expires: new Date(Date.now() + Date.now()), httpOnly: true });
      res.redirect('/');
    }
    // Either the user doesnt exist or the password is wrong
    else {
      res.render('users/login', { title: 'Login', error: true })
    }
  });
};

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
    group_id: 3,
    login_hash: new hashes.SHA1().hex("<('.'<)" + Date.now() + "<('.')>" + Math.random() + "(>'.')>")
  });
  
  // Due to Sequelize being a piece of shit and not including a
  // is-unique validation, we need to pissfart around and do shit like this:
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
  // Should switch to persistance.js, eh?
};