var FindFiles = require("node-find-files");
var fs = require('fs');

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (position === undefined || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

function removeDuplicates(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

exports.findFeatures = function(directory, completeCallback) {
	var finder = new FindFiles({
        rootFolder : directory,
		filterFunction: function(path, stat) {
			return path.endsWith('.feature');
		}
    });
	
	var data = {
		files: [],
		error: false,
		message: null
	};
	
    finder.on("match", function (path, stat) {
        data.files.push(path);
	});
	
	var errorFunction = function(err, strPath) {
		data.error = true;
		data.message = err;
	};
	finder.on("patherror", errorFunction);
	finder.on("error", errorFunction);
	
    finder.on("complete", function () {
        data.files = removeDuplicates(data.files);
		completeCallback(data);
	});
	
	finder.startSearch();
};

exports.loadFiles = function(files, completeCallback) {
	var data = {
		files: [],
		error: false,
		message: null
	};

	for (var f in files) {
		var file = files[f];
		
		fs.readFile(file, 'utf8', function (err, fileData) {
			if (err) {
				data.error = true;
				data.message = err;
				completeCallback(data);
				return;
			}
			data.files.push(fileData);
			if (data.files.length === files.length) {
				completeCallback(data);
			}
		});
	}
};