const assert = require('assert')

function assertLoginData(req, data) {
	try {
		// Check if all keys are present
		const keys = ['email', 'password']

		keys.forEach(key => {
			assert(key in data, `Missing key: ${key}.`)
		})

		// Check if string datas are valid
		keys.forEach(key => {
			assert(typeof data[key] === 'string', `Invalid data in ${key}.`)
		})
	} catch (err) { // catches missing keys
		apiLog(req, err)
		return false
	}
}

function assertPostSaveData(req, isProject, data) {
	try {
		if (isProject) {
			// Check if all keys are present
			const keys = ['idToken', 'projectId', 'projectNumber', 'name', 'description', 'technologies', 'details', 'pictures', 'link']
			keys.forEach(key => {
				assert(key in data, `Missing key: ${key}.`)
			})

			// Check if string datas are valid
			const stringData = ['idToken', 'projectId', 'name', 'description', 'technologies', 'details']
			stringData.forEach(key => {
				assert(typeof data[key] === 'string', `Invalid data in ${key}.`)
			})

			// Check if projectNumber is a number
			assert(typeof data['projectNumber'] === 'number', 'Invalid data in projectNumber.')

			// Check if pictures is an array
			assert(Array.isArray(data['pictures']), 'Invalid data in pictures.')

			// Check if all picture URLs are strings
			data['pictures'].forEach(imageUrl => {
				assert(typeof imageUrl === 'string', 'Invalid data in pictures.')
			})

			// Check if link is an object
			assert(typeof data['link'] === 'object', 'Invalid data in link.')

			// Check if link href and text are strings
			assert(typeof data['link']['href'] === 'string', 'Invalid data in link href.')
			assert(typeof data['link']['text'] === 'string', 'Invalid data in link text.')
		} else {
			// Check if all keys are present
			const keys = ['idToken', 'technologyId', 'technologyNumber', 'name', 'logo']
			keys.forEach(key => {
				assert(key in data, `Missing key: ${key}.`)
			})

			// Check if string datas are valid
			const stringData = ['idToken', 'technologyId', 'name', 'logo']
			stringData.forEach(key => {
				assert(typeof data[key] === 'string', `Invalid data in ${key}.`)
			})

			// Check if technologyNumber is a number
			assert(typeof data['technologyNumber'] === 'number', 'Invalid data in technologyNumber.')
		}
	} catch (err) { // catches missing keys
		apiLog(req, err)
		return false
	}

	return true
}

function assertPostNewData(req, isProject, data) {
	try {
		const key = 'idToken'
		// Check if key is present
		assert(key in data, `Missing key: ${key}.`)

		// Check if string data is valid
		assert(typeof data[key] === 'string', `Invalid data in ${key}.`)
	} catch (err) { // catches missing keys
		apiLog(req, err)
		return false
	}

	return true
}

function assertPostDeleteData(req, isProject, data) {
	try {
		// Check if project or technology
		const keys = isProject ? ['idToken', 'projectId'] : ['idToken', 'technologyId']

		// Check if all keys are present
		keys.forEach(key => {
			assert(key in data, `Missing key: ${key}.`)
		})

		// Check if string datas are valid
		keys.forEach(key => {
			assert(typeof data[key] === 'string', `Invalid data in ${key}.`)
		})
	} catch (err) { // catches missing keys
		apiLog(req, err)
		return false
	}

	return true
}

/**
 * @param {Request} req 
 * @param {String} msg 
 */
function apiLog(req, msg) {
	console.log(`[${req.path}]`, msg)
}

module.exports = {
	assertLoginData: assertLoginData,
	assertPostSaveData: assertPostSaveData,
	assertPostNewData: assertPostNewData,
	assertPostDeleteData: assertPostDeleteData,
	apiLog: apiLog,
};
