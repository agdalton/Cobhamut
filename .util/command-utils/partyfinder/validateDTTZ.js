// Function for performing necessary validations on Partyfinder submitted date, time, and timezone
const { DateTime } = require('luxon')

module.exports = (date, time, ampm, timezone) => {
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

	if (!date && !time && !ampm && !timezone) {
		// Verify none of them have data <-- Nothing is done in this case
	} else if (date && time && ampm && timezone) {
		// Verify all of them have data
		// Validate formatting and validity

		// Validate date
		const dateRgx = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])$/g // RegEx matching MM/dd <-- leading zeros optional
		if (!dateRgx.test(date)) {
			obj.isValid = false
			obj.err.push({
				field: 'Date',
				message: 'Invalid date submitted. Use M/dd.\nFor example, if submitting a partyfinder for May 9th, type 5/9. The date must be within 30 days from today.',
			})
		}

		// Validate time
		const timeRgx = /^(1[0-2]|0?[1-9]):([0-5][0-9])$/g // RegEx matching HH:mm <-- leading zeros optional for HH
		if (!timeRgx.test(time)) {
			obj.isValid = false
			obj.err.push({
				field: 'Time',
				message: 'Invalid time submitted. Use HH:mm.\nFor example, if submitting a partyfinder for 8:30, type 8:30.',
			})
		}

		if (obj.isValid) {
			// Convert hours and minutes to integers
			let hour = parseInt(time.split(':')[0]) // HH:mm index 0 of split is HH
			let minute = parseInt(time.split(':')[1]) // HH:mm index 1 of split is mm

			// Add 12 hours to account for 24hr clock used by Luxon
			if (ampm === 'pm') hour += 12

			// Fix 12:00AM for 24hr clock
			if (ampm === 'am' && hour === 12) hour = 0

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

			const dtZone = { zone: timezone }
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
			message: 'When using the date, time, and timezone options, they all are required.',
		})
	}

	return obj
}
