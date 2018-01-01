//
// All code for CRUD operations at route path /api/menus/:menuId
//

const single = require('express').Router();

// process.env.TEST_DATABASE is only used in testing suite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItems = require('./menu-items/index.js');
single.use('/:menuId/menu-items', menuItems);

// Middleware that checks Database to determine if the supplied menuId exists.
// If it exists, the data is saved to the request object as 'menu'.
// If it does not exist, an error code 404 is sent.
single.param('menuId', (req, res, next, menuId) => {
  const sql = "SELECT * FROM Menu WHERE Menu.id = $menuId",
        values = {$menuId: menuId};
  db.get(sql, values, (error, validMenu) => {
    if (error) {
      next(error);
    } else if (validMenu) {
      req.menu = validMenu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// Returns a 200 response containing the menu with the supplied menu ID on the
// 'menu' property of the response body.
single.get('/:menuId', (req, res, next) => {
  res.status(200).json({menu: req.menu});
});

// Updates the menu with the specified menu ID using the information from the
// menu property of the request body and saves it to the database.
// Returns a 200 response with the updated menu on the menu property of the
// response body.  If any required fields are missing, returns a 400 response.
single.put('/:menuId', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    res.sendStatus(400);
  }
  const sql = "UPDATE Menu SET title = $title WHERE Menu.id = $menuId",
        values = {$title: title, $menuId: req.params.menuId};
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`,
      (error, updatedMenu) => {
        res.status(200).json({menu: updatedMenu});
      });
    }
  });
});

// Deletes the menu with the supplied menu ID from the database if that menu
// has no related menu items. Returns a 204 response.
single.delete('/:menuId', (req, res, next) => {
  const itemSql = "SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId",
        itemValues = {$menuId: req.params.menuId};
  db.get(itemSql, itemValues, (error, existingItem) => {
    if (error) {
      next(error);
    } else if (existingItem) {
      res.sendStatus(400);
    } else {
      const menuId = req.params.menuId;
      const sql = "DELETE FROM Menu WHERE Menu.id = $menuId",
            values = {$menuId: menuId};

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

// exports 'single' router to be used in ./index.js
module.exports = single;
