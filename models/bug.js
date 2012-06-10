/*!
 * Bugs.js
 * Copyright (C) 2012 Nirix
 *
 * Bugs.js is released under the BSD 3-clause license.
 *
 * @license BSD 3-clause
 */

module.exports = function(sequelize, dtype) {
  return sequelize.define("bug", {
    summary: {
      type: dtype.STRING,
      validate: { notEmpty: true }
    },
    description: {
      type: dtype.TEXT,
      validate: { notEmpty: true }
    },
    status: {
      type: dtype.STRING,
      validate: {
        isIn: ['New', 'Accepted', 'Fixed', 'Wont fix', 'Invalid'],
        notEmpty: true
      }
    },
    closed: {
      type: dtype.BOOLEAN,
      validate: { notNull: true }
    }
  },
  {
    timestamps: true,
    collate: 'utf8_general_ci',
    instanceMethods: {
      /**
       * Easily get the URL to the bug report.
       *
       * @return string
       */
      href: function(){
        return "/bugs/" + this.id
      }
    }
  })
}