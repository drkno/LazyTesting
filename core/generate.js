var markdownpdf = require("markdown-pdf"),
    table = require('markdown-table'),
    output = null,
    style = null;

exports.generatePdf = function(data, callback) {
	var tableData = [['Feature','Scenario','Tester','Last Tested','Passing','Comments']];	
	for (var f in data) {
		var feature = data[f];
		for (var i = 0; i < feature.scenarios.length; i++) {
            var scenario = feature.scenarios[i];

			tableData.push([
				i === 0 ? feature.name.replace(/\|/g, "&#124;") : '',
				scenario.name.replace(/\|/g, "&#124;"),
				scenario.tester.replace(/\|/g, "&#124;"),
				scenario.date,
				scenario.passing ? "Yes" : "No",
				scenario.comment.replace(/\|/g, "&#124;")
			]);
		}
	}
	
	var t = table(tableData);
	
	var total = 0;
	var sums = {};	
    for (var i = 1; i < tableData.length; i++) {
        if (!sums[tableData[i][2]]) {
            sums[tableData[i][2]] = 1;
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