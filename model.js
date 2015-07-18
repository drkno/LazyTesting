var files = require('./files.js'),
	feature = require('./feature.js'),
	generate = require('./generate.js'),
	data = null,
  outputPdf = 'doc.pdf';

exports.refreshData = function(completeCallback) {
  files.findFeatures('C:\\Users\\Matthew\\Documents\\University\\2015\\W15 SENG302 Group Project\\project-1\\src\\test\\resources\\sws\\murcs\\', function(f) {
    if (f.error) {
      console.error.log(f.message);
      process.exit(-1);
    }

    files.loadFiles(f.files, function(d) {
      if (d.error) {
        console.error.log(d.message);
        process.exit(-1);
      }

      data = feature.importData(d.files);
      if (data.error) {
  			console.error.log(data.message);
  			process.exit(-1);
  		}
      data = data.features;
      exports.updatePdf(function(){});
      completeCallback();
    });
  });
};

exports.currentState = function() {
  return JSON.stringify(data);
};

exports.updatePdf = function(callback) {
  generate.generatePdf(data, outputPdf, function(){
    callback();
  });
};

exports.setItemData = function(featureIndex, scenarioIndex, tester, passing, comment) {
  if (typeof featureIndex !== "number" || featureIndex < 0 || featureIndex > data.length) {
    throw 'Invalid Feature (' + featureIndex + ')';
  }
  if (typeof scenarioIndex !== "number" || scenarioIndex < 0 || scenarioIndex > data[featureIndex].scenarios.length) {
    throw 'Invalid Scenario (' + scenarioIndex + ')';
  }

  var item = data[featureIndex].scenarios[scenarioIndex];
  if (tester && typeof tester === "string") item.tester = tester;
  if (passing && typeof passing === "boolean") item.passing = passing;
  if (comment && typeof comment === "string") item.comment = comment;

  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  item.date = day + '/' + month + '/' + year;

  exports.updatePdf(function(){});
};

exports.autoAssign = function() {
  var members = ['Dion','Jay','James','Matthew','Hayden','Daniel'];
  var sum = 0, pos = 0;
  for (var i = 0; i < data.length; i++) {
    sum += data[i].scenarios.length;
  }
  sum /= 6;

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].scenarios.length; j++) {
      var item = data[i].scenarios[j];
      item.tester = members[Math.floor(pos / sum) % 6];
      pos++;
    }
  }
  exports.updatePdf(function(){});
};
