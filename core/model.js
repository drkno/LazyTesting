var generate = require('./generate.js'),
    scanner = require('./scanner.js'),
    data = null,
    teamMembers = null;

exports.setup = function (names) {
    teamMembers = names;
};

exports.update = function () {
    scanner.getFeatures(function (features) {
        data = features;
        exports.updatePdf(function () { });
        completeCallback();
    });
};

exports.refreshData = function (completeCallback) {
    scanner.getFeatures(function(features) {
        data = features;
        exports.updatePdf(function() {});
        completeCallback();
    });
};

exports.currentState = function() {
    return JSON.stringify({
        tests: data,
        members: teamMembers
    });
};

exports.updatePdf = function(callback) {
  generate.generatePdf(data, callback);
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
  if (typeof passing === "boolean") item.passing = passing;
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

exports.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

exports.autoAssign = function() {
  var members = exports.shuffleArray(teamMembers);
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