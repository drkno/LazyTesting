var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();

exports.importData = function(newData, testingTags) {
	parser.stopAtFirstError = false;

	var data = {
		features: [],
		error: false,
		message: null
	};

    try {
        var l = false;
        for (var feature in newData) {
			// parse
            var ast = parser.parse(newData[feature]);

			// ensure it is a manual test
			var manualTest = false;
			for (var tag in ast.tags) {
				if (testingTags.indexOf(ast.tags[tag].name.toLowerCase().substr(1)) !== -1) {
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
				var test = '';
				for (var i = 0; i < scenario.steps.length; i++) {
					test += scenario.steps[i].keyword + " " + scenario.steps[i].text + "\r\n";
				}

				scenarios.push({
					name: scenario.name,
					tester: '',
					comment: '',
					test: test,
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
