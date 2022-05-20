/*
Load the jobs
*/
const fs = require('fs')
const path = require('path')

module.exports = () => {
    const files = fs.readdirSync(path.join(__dirname, '../ffxiv_jobs'))
	const jobs = []
	for (const file of files) {
		if (path.extname(file) === '.json') {
			jobs.push(require(path.join(__dirname, '../ffxiv_jobs', file)))
		}
	}

	return jobs
}