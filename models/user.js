/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

module.exports = function(sequelize, dtype) {
  return sequelize.define("user", {
    username: {
      type: dtype.STRING,
      validate: {
        notEmpty: { args: true, msg: "Please enter a username" },
      }
    },
    password: {
      type: dtype.STRING,
      validate: { notEmpty: { args: true, msg: "Password cannot be blank" } }
    },
    email: {
      type:dtype.STRING,
      validate: { isEmail: { args: true, msg: "Invalid email" } }
    },
    isAdmin: {
      type: dtype.BOOLEAN,
      validate: { notNull: true }
    },
    login_hash: {
      type: dtype.STRING,
      validate: { notEmpty: true }
    }
  })
}