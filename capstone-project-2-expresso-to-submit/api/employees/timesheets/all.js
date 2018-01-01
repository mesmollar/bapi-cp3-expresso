//
// All required code for CRUD operations at
// Route: /api/employees/:employeeId/timesheets
//

const all = require('express').Router({mergeParams: true});

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Returns a 200 response containing all saved timesheets related to the employee
// with the supplied employee ID on the timesheets property of the response body.
all.get('/', (req, res, next) => {
  const sql = "SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId";
  const values = {$employeeId: req.params.employeeId};
  db.all(sql, values, (error, allTimesheets) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({timesheets: allTimesheets})
    }
  });
});

// Creates a new timesheet, related to the employee with the supplied employee
// ID, with the information from the timesheet property of the request body
// and saves it to the database. Returns a 201 response with the newly-created
// timesheet on the timesheet property of the response body
all.post('/', (req, res, next) => {
  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date  = req.body.timesheet.date,
        sql = "INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES " +
              "($hours, $rate, $date, $employeeId)",
        values = {
          $hours: hours,
          $rate: rate,
          $date: date,
          $employeeId: req.params.employeeId
        };
  if (!hours || !rate || !date ) {
    return res.sendStatus(400);
  }
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
      (error, newTimesheet) => {
        res.status(201).json({timesheet: newTimesheet});
      });
    }
  });
});

// exports 'all' router to be used in ./index.js
module.exports = all;
