//
// All required code for CRUD operations at route /api/employees/:employeeId
//

const single = require('express').Router();

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const timesheets = require('./timesheets/index.js');
single.use('/:employeeId/timesheets', timesheets);

// Middleware that checks Database to determine if the supplied employeeId exists.
// If it exists, the data is saved to the request object as 'employee'.
// If it does not exist, an error code 404 is sent.
single.param('employeeId', (req, res, next, employeeId) => {
  const sql = "SELECT * FROM Employee WHERE Employee.id = $employeeId";
  const values = {$employeeId: employeeId};
  db.get(sql, values, (error, validEmployee) => {
    if (error) {
      next(error);
    } else if (validEmployee) {
      req.employee = validEmployee;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// Returns a 200 response containing the employee with the supplied employee ID
// on the employee property of the response body
single.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee: req.employee});
});

// Updates the employee with the specified employee ID using the information from
// the employee property of the request body and saves it to the database.
// Returns a 200 response with the updated employee on the employee property
// of the response body. If any required fields are missing, returns a 400 response.
single.put('/:employeeId', (req, res, next) => {
  const name = req.body.employee.name,
        position = req.body.employee.position,
        wage = req.body.employee.wage,
        isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if (!name || !position || !wage) {
    res.sendStatus(400);
  }
  const sql = "UPDATE Employee SET name = $name, position = $position, wage = $wage, " +
              "is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId";
  const values = {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee: isCurrentEmployee,
    $employeeId: req.params.employeeId
  };
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
      (error, updatedEmployee) => {
        res.status(200).json({employee: updatedEmployee});
      });
    }
  });
});

// Updates the employee with the specified employee ID to be unemployed
// (is_current_employee equal to 0), and returns a 200 response.
single.delete('/:employeeId', (req, res, next) => {
  const sql = "UPDATE Employee SET is_current_employee = 0 WHERE " +
              "Employee.id = $employeeId";
  const values = {$employeeId: req.params.employeeId};
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
      (error, deletedEmployee) => {
        res.status(200).json({employee: deletedEmployee});
      });
    }
  });
});

// exports 'single' router to be used in ./index.js
module.exports = single;
