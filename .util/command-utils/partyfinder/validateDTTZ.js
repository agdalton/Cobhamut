// Function for performing necessary validations on Partyfinder submitted date, time, and timezone
const { DateTime } = require('luxon')

module.exports = (date, timeTZ) => {
	// Setup an object to return with all the info we might need later
	const obj = {
		isValid: true,
		dttz: false,
		pfDT: {
			dtObj: new Object(),
			dtZone: new Object(),
		},
		err: [],
	}

	if (!date && !timeTZ) {
		// Verify none of them have data <-- Nothing is done in this case
	} else if (date && timeTZ) {
		// Verify all of them have data
		// Validate formatting and validity

		// Validate date
		const dateRgx = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])$/g // RegEx matching MM/dd <-- leading zeros optional
		if (!dateRgx.test(date)) {
			obj.isValid = false
			obj.err.push({
				field: 'Date',
				message: 'Invalid date submitted. Use MM/dd.\nFor example, if submitting a partyfinder for May 9th, use 5/9. Date must be within 30 days from today.',
			})
		}

		// Validate timeTZ
		const timeTZRgx =
			/^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M) ([A-Z]{2,3})$/g
		if (!timeTZRgx.test(timeTZ)) {
			obj.isValid = false
			obj.err.push({
				field: 'Time and timezone',
				message: 'Invalid time and timezone submitted. Use HH:mmAM/PM TZ. For example, if submitting a partyfinder for 8:30 PM Eastern, use 8:30PM EST.',
			})

			return obj // if we can't split timeTZ on the whitespace, we have to return as none of it can be validated
		}

		const time = timeTZ.split(' ')[0].trim()
		const timezone = timeTZ.split(' ')[1].trim()

		// Validate time
		const timeRgx = /^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/g // RegEx matching HH:mm <-- leading zeros optional for HH
		if (!timeRgx.test(time)) {
			obj.isValid = false
			obj.err.push({
				field: 'Time and timezone',
				message: 'Invalid time submitted. Use HH:mmAM/PM.\nFor example, if submitting a partyfinder for 8:30 PM, use 8:30PM.',
			})
		}

		// Validate timezone
		let longTz = '' // Required for Luxon
		switch (timezone) {
			case 'EST':
			case 'EDT':
			case 'ET':
				longTz = 'America/New_York'
				break
			case 'CST':
			case 'CDT':
			case 'CT':
				longTz = 'America/Chicago'
				break
			case 'PST':
			case 'PDT':
			case 'PT':
				longTz = 'America/Los_Angeles'
				break
			default:
				obj.isValid = false
				obj.err.push({
					field: 'Time and timezone',
					message: 'Invalid timezone submitted.\nFor US/Pacific: PST, PDT, PT\nFor US/Central: CST, CDT, CT\nFor US/Eastern: EST, EDT, ET\nNo other timezones are currently supported.',
				})
		}

		if (obj.isValid) {
			const meridiem = time.substring(time.length - 2) // AM/PM
			const arrTime = time.slice(0, -2).split(':') // [0] is hour [1] is minutes
			// Convert hours and minutes to integers
			let hour = parseInt(arrTime[0]) // HH:mm index 0 of split is HH
			let minute = parseInt(arrTime[1]) // HH:mm index 1 of split is mm
			// Add 12 hours to account for 24hr clock used by Luxon
			if (meridiem === 'PM') hour += 12
			// Get the current year
			const nowDT = DateTime.now()
			const currentYear = nowDT.year
			// Begin constructing a Luxon DateTime for the partyfinder
			const dtObj = {
				year: currentYear,
				month: parseInt(date.split('/')[0]), // MM/dd index 0 of split is MM
				day: parseInt(date.split('/')[1]), // MM/dd index 1 of split is dd
				hour: hour,
				minute: minute,
			}
			const dtZone = { zone: longTz }
			const pfDT = DateTime.fromObject(dtObj, dtZone)

			// Set an error if Luxon determines the DateTime is invalid
			if (!pfDT.isValid) {
				obj.isValid = false
				obj.err.push({
					field: 'Luxon DateTime Error',
					message: pfDT.invalidExplanation,
				})
			} else {
				// Enforce a 30 day maximum
				const daysFromNow30 = nowDT.plus({ days: 30 })
				if (pfDT <= nowDT) {
					obj.isValid = false
					obj.err.push({
						field: 'Date',
						message: "Cobhamut can only schedule future partyfinders! Use a date that's up to 30 days into the future.",
					})
				} else if (daysFromNow30 < pfDT) {
					obj.isValid = false
					obj.err.push({
						field: 'Date',
						message: 'Cobhamut can only schedule up to 30 days in advance.',
					})
				} else {
					obj.pfDT.dtObj = dtObj
					obj.pfDT.dtZone = dtZone
					obj.pfDT.dtISO = pfDT.toISO()
				}
			}

			// Last check so we can flag that all 3 are good
			if (obj.isValid) obj.dttz = true
		}
	} else {
		// if one of them have data, but the others don't - return an error
		obj.isValid = false
		obj.err.push({
			field: 'Mandatory',
			message: 'When using the date, time, and timezone fields all 3 are required.',
		})
	}

	return obj
}
