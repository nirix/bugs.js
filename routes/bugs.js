/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

// Bug listing
exports.index = function(req, res) {
  models.Bug.findAll().success(function(bugs){
  	res.render('bugs/index', { title: 'Bugs', bugs: bugs })
  });
};

// View bug
exports.view = function(req, res) {
	models.Bug.find({ where: { id: req.param('id') }}).success(function(bug){
		res.render('bugs/view', { title: bug.summary + " - Bugs", bug: bug });
	})
	.error(function(){
		res.send('');
	});
}

// New bug form
exports.new = function(req, res)
{
	res.render('bugs/new', { title: 'Report Bug' });
}

// Create the bug
exports.create = function(req, res) {
	res.send(req.body.bug);
}