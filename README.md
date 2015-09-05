# LazyTesting

A node.js based program for parsing manual gherkin/cucumber feature files and generating a pdf based manual test plan.

### Running

<b>NOTE:</b> Programs such as Skype must not be occupying port 80 before running.
First edit line 8 of `model.js` to point to your directory containing cucumber test files.
Next run these commands in the root of the project:
```
npm install
node server.js
```
Then navigate to localhost:80 in a web browser.

### Credit
To whomever I borrowed the markdown.css from. It was in an open source repo somewhere that I can no longer locate.

### License
MIT License on all origional code. All other code is under it own respective licenses.
