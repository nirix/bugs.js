/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

exports.index = function(req, res) {
  models.Bug.findAll().success(function(bugs){
  	res.render('bugs/index', { title: 'Bugs', bugs: bugs })
  });
};

exports.view = function(req, res) {
	models.Bug.find({ where: { id: req.param('id') }}).success(function(bug){
		res.render('bugs/view', { title: bug.summary + " - Bugs", bug: bug });
	})
	.error(function(){
		res.send('');
	});
}

exports.new = function(res, res)
{
	res.send('new');
}