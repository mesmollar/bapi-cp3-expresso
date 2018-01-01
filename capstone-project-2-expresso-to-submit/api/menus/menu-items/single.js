//
// All code for CRUD operations at
// Route path /api/menus/:menuId/menu-items/:menuItemId
//

const single = require('express').Router({mergeParams: true});

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Middleware that checks Database to determine if the supplied menuItemId exists.
// If it exists, we proceed to the next code block.
// If it does not exist, an error code 404 is sent.
single.param('menuItemId', (req, res, next, menuItemId) => {
  const sql = "SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId",
        values = {$menuItemId: menuItemId};
  db.get(sql, values, (error, validMenuItem) => {
    if (error) {
      next(error);
    } else if (validMenuItem) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// Updates the menu item with the specified menu item ID using the information
// from the menuItem property of the request body and saves it to the database.
// Returns a 200 response with the updated menu item on the menuItem property
// of the response body.  If any required fields are missing, returns a 400 response.
single.put('/:menuItemId', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        menuId = req.params.menuId,
        menuSql = "SELECT * FROM Menu WHERE Menu.id = $menuId",
        menuValues = {$menuId: menuId};
  db.get(menuSql, menuValues, (error, menu) => {
    if (error) {
      next(error);
    } else {
      if (!name || !description || !inventory || !price || !menu) {
        return res.sendStatus(400);
      }

      const sql = "UPDATE MenuItem SET name = $name, description = $description, " +
                  "inventory = $inventory, price = $price, menu_id = $menuId " +
                  "WHERE MenuItem.id = $menuItemId",
            values = {
              $name: name,
              $description: description,
              $inventory: inventory,
              $price: price,
              $menuId: menuId,
              $menuItemId: req.params.menuItemId
            };
      db.run(sql, values, function(error) {
        if(error) {
          next(error);
        } else {
          db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
          (error, updatedMenuItem) => {
            res.status(200).json({menuItem: updatedMenuItem});
          });
        }
      });
    }
  });
});

// Deletes the menu item with the supplied menu item ID from the database and
// returns a 204 response.
single.delete('/:menuItemId', (req, res, next) => {
  const sql = "DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId",
        values = {$menuItemId: req.params.menuItemId};
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
