"use strict";
var bodyParser = require("body-parser");
var morgan = require("morgan");
var compression = require("compression");
//Configuration of various modules and express
module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ "extended": true }));
    app.use(compression());
    app.use(morgan("tiny"));
};