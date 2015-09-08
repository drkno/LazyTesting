/*
 * Lazy Testing
 * Automated Manual Testing document generator.
 * 
 * Copyright 2015 © Matthew Knox. Licensed under the MIT license.
 */

var path = require('path'),
    scanner = require('./core/scanner.js'),
    server = require('./core/server.js'),
    model = require('./core/model.js'),
    generator = require('./core/generate.js'),
    config;

var startupString =
        "Lazy Testing\n" +
        "-------------------------------\n" +
        "Performing statup tests...";
console.log(startupString);

// Check config file exists.
try {
    config = require('./config.json');
} catch (e) {
    console.log("[FAIL] Config file missing.");
    return;
}
console.log("[PASS] Config file present.");

// Check valid port number
if (!config.port || typeof config.port !== "number" || config.port <= 0) {
    console.log("[FAIL] Missing or invalid port number provided.");
    return;
}
console.log("[PASS] Valid port number provided.");

// Check names
if (!config.names || !config.names.length || config.names.length <= 0) {
    console.log("[FAIL] Names of team members not defined.");
    return;
}
console.log("[PASS] Names of team members were provided.");

// Check feature files directory
if (!config.featureFilesFolder) {
    console.log("[FAIL] Feature files folder not defined.");
    return;
}
console.log("[PASS] Feature files folder is defined.");

// Check styles
if (!config.style) {
    console.log("[FAIL] No styles in config. Defaulting to default.css");
    config.style = path.join(__dirname, 'styles', 'default.css');
} else {
    console.log("[PASS] Found custom styles in config.");
}

console.log("Tests complete.");
console.log("Setting up scanner.");
scanner.setup(config.featureFilesFolder);

console.log("Setting up generator.");
generator.setup(path.join(__dirname, 'html', 'ManualTesting.pdf'), config.style);

console.log("Setting up model.");
model.setup(config.names);

console.log("Setting up server.");
server.setup(config.port, path.join(__dirname, 'html'));

console.log("Starting server on port " + config.port + ".");

server.start();
console.log("Lazy Testing has started. Hello World!");