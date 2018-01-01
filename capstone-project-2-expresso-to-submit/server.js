const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const cors = require('cors');
const apiRouter = require('./api/api.js');

const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRouter);


app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

module.exports = app;
