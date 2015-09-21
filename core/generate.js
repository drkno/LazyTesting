var markdownpdf = require("markdown-pdf"),
    table = require('markdown-table'),
    removeMd = require('remove-markdown'),
    output = null,
    style = null;

exports.generatePdf = function(data, callback) {
	var tableData = [['Feature','Scenario','Tester','Last Tested','Passing','Comments']];	
	for (var f in data) {
		var feature = data[f];
		for (var i = 0; i < feature.scenarios.length; i++) {
            var scenario = feature.scenarios[i];

			tableData.push([
				i === 0 ? removeMd(feature.name) : '',
                removeMd(scenario.name),
                removeMd(scenario.tester),
				scenario.date,
				scenario.passing ? "Yes" : "No",
                removeMd(scenario.comment)
			]);
		}
	}
	
	var t = table(tableData);
	
	var total = 0;
	var sums = {};	
    for (var i = 1; i < tableData.length; i++) {
        if (!sums[tableData[i][2]]) {
            if (tableData[i][2] === "" || tableData[i][2] === null) {
                if (!sums["Nobody"]) {
                    sums["Nobody"] = 1;
                } else {
                    sums["Nobody"]++;
                }
            } else {
                sums[tableData[i][2]] = 1;
            }
        } else {
            sums[tableData[i][2]]++;
        }
		total++;
	}
	
	var summaryData = [['Tester','Number of Tests']];
	for (var name in sums) {
		summaryData.push([name, sums[name]]);
	}
	summaryData.push(['Total Tests', total]);
	
	var s = table(summaryData);
	var markDown = "# Manual Testing Plan\n" + t + "\n\n" + s;
	markdownpdf({cssPath: style}).from.string(markDown).to(output, callback);
};

exports.setup = function (outputFile, styles) {
    output = outputFile;
    style = styles;
};