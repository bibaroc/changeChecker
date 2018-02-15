"use strict";
module.exports = function(application){
    application.use("/api/cascamerino", require("../api/cascamerino"));
};