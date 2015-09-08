var files = require('./files.js'),
    feature = require('./feature.js'),
    featuresFolder = null;

exports.setup = function(fff) {
    featuresFolder = fff;
};

exports.getFeatures = function(callback) {
    files.findFeatures(featuresFolder, function (f) {
        if (f.error) {
            throw f.message;
        }
        
        files.loadFiles(f.files, function (d) {
            if (d.error) {
                throw d.message;
            }
            
            var features = feature.importData(d.files);
            if (features.error) {
                throw features.message;
            }
            callback(features.features);
        });
    });
};