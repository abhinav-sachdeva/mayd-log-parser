const detailsMap = {
	info: "msg",
	debug: "debug",
	warn: "warn",
	error: "err"
}
function processLog(log) {
	const delimiter = ' - ';
	let [time, severity] = log.substring(0, 50).split(delimiter);
	const data = log.substring(time.length + severity.length + 2 * delimiter.length);
	const json = JSON.parse(data);
	return `{"timestamp":"${time}", "logLevel":"${severity}", "transactionId":"${json.transactionId || ''}", "${detailsMap[severity.trim()] || "msg"}":"${json.details}"},`
}

module.exports = processLog;