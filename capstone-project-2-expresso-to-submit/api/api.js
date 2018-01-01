/*
All Route Paths and their file locations:

/api/employees routes are defined in root/api/employees/all.js

/api.employees/:employeeId routes are defined in root/api/employees/single.js

/api/employees/:employeeId/timesheets routes are defined in
root/api/employees/timesheets/all.js

/api/employees/:employeeId/timesheets/:timesheetId routes are defined in
root/api/employees/timesheets/single.js

/api/menus routes are defined in root/api/menus/all.js

/api/menus/:menuId routes are defined in root/api/menus/single.js

/api/menus/:menuId/menu-items routes are defined in root/api/menus/menu-items/all.js

/api/menus/:menuId/menu-items/:menuItemId routes are defined in
root/api/menus/menu-items/single.js
*/

const apiRouter = require('express').Router();

// Connects main apiRouter to all routes beginning api/employees...
const employees = require('./employees/index.js');
apiRouter.use('/employees', employees);

// Connects main apiRouter to all routes beginning api/menus
const menus = require('./menus/index.js');
apiRouter.use('/menus', menus);

// Exports apiRouter to be used in ../server.js
module.exports = apiRouter;
