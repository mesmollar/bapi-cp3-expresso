//
// All required code for CRUD operations at route /api/employees
//

const all = require('express').Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Returns a 200 response containing all saved currently-employed employees
// (is_current_employee is equal to 1) on the employees property of the
// response body
all.get('/', (req, res, next) => {
  db.all("SELECT * FROM Employee WHERE is_current_employee = 1", (err, allCurrentEmployees) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({employees: allCurrentEmployees});
    }
  });
});

// Creates a new employee with the information from the employee property of the
// request body and saves it to the database. Returns a 201 response with the
// newly-created employee on the employee property of the response body.
// If any required fields are missing, returns a 400 response.
all.post('/', (req, res, next) => {
  const name = req.body.employee.name,
        position = req.body.employee.position,
        wage = req.body.employee.wage,
        isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if (!name || !position || !wage) {
    res.sendStatus(400);
  } else {
    const sql = "INSERT INTO Employee (name, position, wage, is_current_employee) " +
                "VALUES ($name, $position, $wage, $isCurrentEmployee)";
    const values = {
      $name: name,
      $position: position,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee
    };
    db.run(sql, values, function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
          (error, createdEmployee) => {
          res.status(201).json({employee: createdEmployee})
        });
      }
    });
  }
});

// exports 'all' router to be used in index.js
module.exports = all;
