// api/menus/menu-items/index.js simply connects to other routers defined in
// separate files in the current directory so that each route path has all code
// required for CRUD operations segregated into its own individual file

const menuItems = require('express').Router({mergeParams: true});

const all = require('./all');
menuItems.use('/', all);

const single = require('./single');
menuItems.use('/', single);

// exports menuItems router to be used in ../single.js
module.exports = menuItems;
