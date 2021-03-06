"use strict";

const getImportDeclaration = require("./getImportDeclaration");

module.exports = function (dependencies, options) {
    // should we check whether require is the first param and exports is second?
    return dependencies.filter(function (dependency) {
        return dependency.element !== "require" && dependency.element !== "exports";
    }).map(function (dependency) {
        return getImportDeclaration(dependency.element, dependency.param, options);
    });
};
