const { DateTime } = require('luxon')

module.exports = (days, time, timezone, roleChannelHours) => {
	// Setup an object to return with all the info we might need later
	const obj = {
		isValid: true,
		days: [],
		friendlyDays: [],
		timezone: '',
		role: '',
		channel: '',
		err: [],
	}

	// Validate Days and build an array of day indices and an array of friendly day names in a standard format
	try {
		let daysOfWeek = days.toLowerCase().split(',')
		if (daysOfWeek.length > 7)
			throw new Error('There are only seven days in a week.')

		for (let i = 0; i < daysOfWeek.length; i++) {
			switch (daysOfWeek[i].trim()) {
				case 'monday':
				case 'mon':
				case 'm':
					daysOfWeek[i] = 1
					break
				case 'tuesday':
				case 'tues':
				case 't':
				case 'tu':
					daysOfWeek[i] = 2
					break
				case 'wednesday':
				case 'wed':
				case 'w':
					daysOfWeek[i] = 3
					break
				case 'thursday':
				case 'thurs':
				case 'th':
				case 'r':
					daysOfWeek[i] = 4
					break
				case 'friday':
				case 'fri':
				case 'f':
					daysOfWeek[i] = 5
					break
				case 'saturday':
				case 'sat':
				case 's':
					daysOfWeek[i] = 6
					break
				case 'sunday':
				case 'sun':
				case 'su':
				case 'u':
					daysOfWeek[i] = 7
					break
				default:
					throw new Error()
			}
		}

		obj.days = daysOfWeek.sort()

		// Setup array with friendly day abbreviations
		for (let i = 0; i < obj.days.length; i++) {
			switch (obj.days[i]) {
				case 1:
					obj.friendlyDays.push('Mon')
					break
				case 2:
					obj.friendlyDays.push('Tues')
					break
				case 3:
					obj.friendlyDays.push('Wed')
					break
				case 4:
					obj.friendlyDays.push('Thurs')
					break
				case 5:
					obj.friendlyDays.push('Fri')
					break
				case 6:
					obj.friendlyDays.push('Sat')
					break
				case 7:
					obj.friendlyDays.push('Sun')
					break
			}
		}
	} catch (e) {
		obj.isValid = false
		obj.err.push({
			field: 'Days',
			message:
				'Invalid list of days submitted. Use a comma-delimited list. For example, if your static raids on the weekends, use Sat,Sun.\n\n' +
				'>>>**Supported abbreviations:**\nSunday: Sun, SU, U\nMonday: Mon, M\nTuesday: Tues, TU, T\nWednesday: Wed, W\nThursday: Thurs, TH, R\nFriday: Fri, F\nSaturday: Sat, S',
		})
	}

	// Validate time
	const timeRgx = /^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/g
	if (!timeRgx.test(time)) {
		obj.isValid = false
		obj.err.push({
			field: 'Time',
			message: 'Invalid time submitted. Use HH:mmAM/PM. For example, if your static raids at 8:30 PM, use 8:30PM.',
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
				field: 'Timezone',
				message: 'Invalid timezone submitted.\nFor US/Pacific: PST, PDT, PT\nFor US/Central: CST, CDT, CT\nFor US/Eastern: EST, EDT, ET\nNo other timezones are currently supported.',
			})
	}

	obj.timezone = longTz

	// Validate Role and Channel
	try {
		obj.role = roleChannelHours.split(',')[0]
		obj.channel = roleChannelHours.split(',')[1]
		obj.reminderHours = roleChannelHours.split(',')[2]
	} catch (e) {
		obj.isValid = false
		obj.err.push({
			field: 'Role, Channel, Hours',
			message: 'An error occurred while processing the Role, Channel, Hours field. When submitting the Raid Reminder form, **DO NOT change the Role, Channel, Hours field**',
		})
	}

	return obj
}
