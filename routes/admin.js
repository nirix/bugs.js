/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

// Index page
exports.index = function(req, res) {
  var engadge = function(users) {
    res.render('admin/index', { title: 'Admin', users: users });
  }

  models.User.findAll().success(function(users){
    engadge(users);
  })
  .error(function(){
    engadge([]);
  });
}

// Change users admin status
exports.set_admin_status = function(req, res) {
  models.User.find({ where: { id: req.param('id') }}).success(function(user){
    if (req.param('isadmin') == "true") {
      user.isAdmin = true;
    } else {
      user.isAdmin = false;
    }
    
    user.save().success(function(){
      res.redirect('/.admin');
    })
  })
  .error(function(){
    res.redirect('/.admin');
  })
}