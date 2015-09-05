var markdownpdf = require("markdown-pdf");
var table = require('markdown-table');

exports.generatePdf = function(data, location, callback) {
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
	var sum = [0,0,0,0,0,0];
	for (var i = 1; i < tableData.length; i++) {
		switch(tableData[i][2]) {
			case 'Dion': sum[0]++; break;
			case 'Jay': sum[1]++; break;
			case 'James': sum[2]++; break;
			case 'Matthew': sum[3]++; break;
			case 'Hayden': sum[4]++; break;
			case 'Daniel': sum[5]++; break;
		}
		total++;
	}
	
	var summaryData = [
		['Tester','Number of Tests'],
		['Dion',sum[0]],
		['Jay',sum[1]],
		['James',sum[2]],
		['Matthew',sum[3]],
		['Hayden',sum[4]],
		['Daniel',sum[5]],
		['Total Tests',total]
	];
	
	var s = table(summaryData);
	
	var markDown = "# Manual Testing Plan\n" + t + "\n\n" + s;
	
	markdownpdf({cssPath:"markdown.css"}).from.string(markDown).to(location, callback);
};