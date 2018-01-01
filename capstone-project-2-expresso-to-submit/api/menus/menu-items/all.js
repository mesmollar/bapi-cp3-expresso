//
// All code for CRUD operations at route path /api/menus/:menuId/menu-items
//

const all = require('express').Router({mergeParams: true});

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Returns a 200 response containing all saved menu items related to the menu
// with the supplied menu ID on the 'menuItems' property of the response body.
all.get('/', (req, res, next) => {
  const sql = "SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId",
        values = {$menuId: req.params.menuId};
  db.all(sql, values, (error, allMenuItems) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({menuItems: allMenuItems});
    }
  });
});


// Creates a new menu item, related to the menu with the supplied menu ID, with
// the information from the menuItem property of the request body and saves it
// to the database. Returns a 201 response with the newly-created menu item
// on the menuItem property of the response body.
// If any required fields are missing, returns a 400 response.
all.post('/', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        sql = "INSERT INTO MenuItem (name, description, inventory, price, menu_id) " +
              "VALUES ($name, $description, $inventory, $price, $menuId)",
        values = {
          $name: name,
          $description: description,
          $inventory: inventory,
          $price: price,
          $menuId: req.params.menuId
        };
  if (!name || !description || !inventory || !price) {
    return res.sendStatus(400);
  }
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
      (error, newMenuItem) => {
        res.status(201).json({menuItem: newMenuItem});
      });
    }
  });
});

// exports 'all' router to be used in ./index.js
module.exports = all;
