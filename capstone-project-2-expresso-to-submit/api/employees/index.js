// api/employees/index.js simply connects to other routers defined in separate
// files in the current directory so that each route path has all code
// required for CRUD operations segregated into its own individual file

const employees = require('express').Router();

const all = require('./all.js');
employees.use('/', all);

const single = require('./single.js');
employees.use('/', single);

// exports employees router to be used in ../api.js
module.exports = employees;
