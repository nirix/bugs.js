/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

var Bug = db.import(__dirname + '/bug.js')
  , User = db.import(__dirname + '/user');

var models = {
  Bug: Bug,
  User: User
}

models.Bug.belongsTo(models.User);

module.exports = models;