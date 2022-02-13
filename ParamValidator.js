const fs = require('fs').promises;

const getValidParams = () => {
	const validParams = {
		'--input': {
			required: true,
			default: '',
			value: '',
			help: '--input </source/file/path>'
		},
		'--output': {
			required: true,
			default: '',
			value: '',
			help: '--output </destination/file/path>'
		}
	};

	return validParams;
};

const mapInputToParams = (validParams, inputs) => {
	for (let idx = 0; idx < inputs.length; idx++) {
		const param = inputs[idx];
		if (validParams.hasOwnProperty(param)) {
			validParams[param] = inputs[idx + 1];
		}
	}
};

const runValidations = (paramWithInputs) => {
	const errors = [];
	for (const param in paramWithInputs) {
		if (param.required && !param.value) {
			errors.push(`Required param skipped: ${param.help}`);
		}
	}
	return {
		valid: errors.length === 0,
		errors: errors.join('\n')
	}
}

const validateParams = (inputs) => {
	validParams = getValidParams();
	mapInputToParams(validParams, inputs);
	const { valid, errors } = runValidations(validParams);
	if (errors.length) {
		console.error(errors);
	}
	return { valid, mappedInputs: validParams };
}

const checkPermissions = async (params) => {
	const sourcePermErr = await fs.access(params['--input'], fs.R_OK)
	const destPermErr = await fs.access(params['--output'], fs.W_OK)
	if (sourcePermErr || destPermErr) {
		console.error(`${sourcePermErr}\n${destPermErr}`);
		return false;
	}
	return true;
}

validateParams(process.argv);
module.exports = {
	validateParams,
	checkPermissions
};