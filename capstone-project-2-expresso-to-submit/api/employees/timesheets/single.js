const single = require('express').Router({mergeParams: true});

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Middleware that checks Database to determine if the supplied timesheetId exists.
// If it exists, we proceed to the next code block.
// If it does not exist, an error code 404 is sent.
single.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = "SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId",
        values = {$timesheetId: timesheetId};
  db.get(sql, values, (error, validTimesheet) => {
    if (error) {
      next(error);
    } else if (validTimesheet) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// Updates the timesheet with the specified timesheet ID using the information
// from the timesheet property of the request body and saves it to the database.
// Returns a 200 response with the updated timesheet on the timesheet property
// of the response body.  If any required fields are missing, returns a 400
// response.
single.put('/:timesheetId', (req, res, next) => {
  const hours = req.body.timesheet.hours,
        rate =  req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.params.employeeId,
        empSql = "SELECT * FROM Employee WHERE Employee.id = $employeeId",
        empValues = {$employeeId: employeeId};
  db.get(empSql, empValues, (error, validEmployee) => {
    if (error) {
      next(error);
    } else {
      if (!hours || !rate || !date || !validEmployee) {
        return res.sendStatus(400);
      }

      const sql = "UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, " +
                  "employee_id = $employeeId WHERE Timesheet.id = $timesheetId",
            values = {
              $hours: hours,
              $rate: rate,
              $date: date,
              $employeeId: employeeId,
              $timesheetId: req.params.timesheetId
            };
      db.run(sql, values, function(error) {
        if(error) {
          next(error);
        } else {
          db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
          (error, updatedTimesheet) => {
            res.status(200).json({timesheet: updatedTimesheet});
          });
        }
      });
    }
  });
});

// Deletes the timesheet with the supplied timesheet ID from the database and
// returns a 204 response.
single.delete('/:timesheetId', (req, res, next) => {
  const sql = "DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId",
        values = {$timesheetId: req.params.timesheetId};
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});

// exports 'single' router to be used in ./index.js
module.exports = single;
