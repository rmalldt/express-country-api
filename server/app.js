const express = require('express');
const cors = require('cors');
const countryRouter = require('./routers/countries');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/countries', countryRouter);

module.exports = app;
