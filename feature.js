var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();

exports.importData = function(newData) {
	parser.stopAtFirstError = false;

	var data = {
		features: [],
		error: false,
		message: null
	};
	
	try {
		for (var feature in newData) {
			// parse
			 var ast = parser.parse(newData[feature]);
			
			// ensure it is a manual test
			var manualTest = false;
			for (var tag in ast.tags) {
				if (ast.tags[tag].name === "@Manual") {
					manualTest = true;
					break;
				}
			}
			if (!manualTest) {
				continue;
			}
			
			// generate our own data tree
			var scenarios = [];
			for (var s in ast.scenarioDefinitions) {
				var scenario = ast.scenarioDefinitions[s];
				scenarios.push({
					name: scenario.name,
					tester: '',
					comment: '',
					date: null,
					passing: false
				});
			}
			
			data.features.push({
				name: ast.name,
				scenarios: scenarios
			});
		}
	}
	catch(e) {
		data.error = true;
		data.message = e.message;
	}
	
	return data;
};