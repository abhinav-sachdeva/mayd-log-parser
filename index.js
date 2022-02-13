const fs = require('fs'),
	readline = require('readline'),
	processLog = require('./logProcessor');

const destination = fs.createWriteStream("./dest.json")
const source = fs.createReadStream('./source.log');

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
	destination.write(`${processLog(line)}\n`);
});