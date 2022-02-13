const fs = require('fs'),
	readline = require('readline'),
	processLog = require('./logProcessor');

const { validateParams, checkPermissions } = require('./ParamValidator')
const { mappedInputs, valid } = validateParams(process.argv);
if (!valid) {
	process.exit(1);
}
const filePermValid = checkPermissions(mappedInputs);
if (!filePermValid) {
	process.exit(1);
}

const destination = fs.createWriteStream(mappedInputs['--output'])
const source = fs.createReadStream(mappedInputs['--input']);

source.on("ready", function () {
	destination.write("[")
});

source.on("end", function () {
	destination.write("{}]\n");
	destination.close();
});

const rl = readline.createInterface({
	input: source
});

rl.on('line', function (line) {
	source.pause()
	destination.write(`${processLog(line)}\n`);
	source.resume()
});
