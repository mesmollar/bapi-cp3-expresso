// api/employees/timesheets/index.js simply connects to other routers defined
// in separate files in the current directory so that each route path has all
//  code required for CRUD operations segregated into its own individual file

const timesheets = require('express').Router({mergeParams: true});

const all = require('./all');
timesheets.use('/', all);

const single = require('./single');
timesheets.use('/', single);

// exports timesheets router to be used in ../single.js
module.exports = timesheets;
