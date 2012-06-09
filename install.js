/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

// Fetch database connection and globalize it
var db = require('./db.js');
global.db = db;

// Fetch models
var models = require('./models');

// Explain what we're doing just cause
console.log('syncing database tables....');
db.sync();
console.log('done');