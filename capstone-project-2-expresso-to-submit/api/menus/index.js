// api/menus/index.js simply connects to other routers defined in separate
// files in the current directory so that each route path has all code
// required for CRUD operations segregated into its own individual file

const menus = require('express').Router();

const all = require('./all.js');
menus.use('/', all);

const single = require('./single.js');
menus.use('/', single);

// Exports menus router to be used in ../api.js
module.exports = menus;
