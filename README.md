# LazyTesting

A node.js based program for parsing manual gherkin/cucumber feature files and generating a pdf based manual test plan.

### Running

<b>NOTE:</b> Programs such as Skype must not be occupying your port before running.

First create a configuration file `config.json` based off the following template in the directory that contains `lazy.js`.
```
{
	"port": 80,
	"featureFilesFolder": "/home/mycoolusername/projects/awesomeproject",
	"names": [
		"Myself",
		"A friend of mine",
		"Another Friend"
	]
}
```

Next run these commands in the root of the project:
```
npm install
node lazy.js
```
Then navigate to `localhost:<portNumber>` in a web browser.

### Credit
To whomever I borrowed the `default.css` from. It was in an open source repo somewhere that I can no longer locate.

### License
MIT License on all origional code. All other code is under it own respective licenses.
