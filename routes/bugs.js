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
  	var total = bugs.length;
  	bugs.forEach(function(bug){
  		bug.getUser().success(function(user){
  			bug.user = user;
  			if (--total === 0) {
		 		res.render('bugs/index', { title: 'Bugs', bugs: bugs });
  			}
  		});
  	});
  });
};

// View bug
exports.view = function(req, res) {
	models.Bug.find({ where: { id: req.param('id') }}).success(function(bug){
		bug.getUser().success(function(user){
			bug.user = user;
			res.render('bugs/view', { title: bug.summary + " - Bugs", bug: bug });
		});
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
	var bug = models.Bug.build({
		summary: req.body.bug.summary,
		description: req.body.bug.description,
		userId: req.session.user.id,
		status: 'New',
		closed: false
	});

	var errors = bug.validate();

	// Check for errors
	if (bug.errors) {
		res.render('bugs/new', { title: 'Report Bug', error: errors });
	}
	// All good, redirect to bug report
	else {
		bug.save().success(function(){
			res.redirect(bug.href());
		});
	}
}

// Update bug status
exports.update_status = function(req, res) {
	models.Bug.find({ where: { id: req.param('id') }}).success(function(bug){
		bug.status = req.body.bug.status;

		if (bug.status in {'Fixed':'', 'Wont Fix':'', 'Invalid':''}) {
			bug.closed = true;
		} else {
			bug.closed = false;
		}
		
		bug.save().success(function(){
			res.redirect(bug.href());
		});
	})
	.error(function(){
		res.send('');
	});
}