"use strict";
var app = require("express")();

require("./config/express")(app);
require("./config/routes")(app);

app.listen(process.env.PORT || 8080, function () {
    console.log("Listening for http requests on port: " + (process.env.PORT || 8080));
});