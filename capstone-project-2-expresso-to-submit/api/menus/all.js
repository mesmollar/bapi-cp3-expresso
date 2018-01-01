//
// All code for CRUD operations at route path /api/menus
//

const all = require('express').Router();

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Returns a 200 response containing all saved menus on the 'menus' property
// of the response body.
all.get('/', (req, res, next) => {
  db.all("SELECT * FROM Menu", (err, allMenus) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({menus: allMenus});
    }
  });
});

// Creates a new menu with the information from the menu property of the request
// body and saves it to the database. Returns a 201 response with the
// newly-created menu on the menu property of the response body.
// If any required fields are missing, returns a 400 response.
all.post('/', (req, res, next) => {
  const title = req.body.menu.title
  if (!title) {
    res.sendStatus(400);
  } else {
    const sql = "INSERT INTO Menu (title) VALUES ($title)",
          values = {$title: title};
    db.run(sql, values, function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
        (error, createdMenu) => {
          res.status(201).json({menu: createdMenu});
        });
      }
    });
  }
});

// exports 'all' router to be used in ./index.js
module.exports = all;
