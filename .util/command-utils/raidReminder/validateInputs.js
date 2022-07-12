const { DateTime } = require('luxon')

module.exports = async (
	client,
	interaction,
	days,
	timeTZ,
	titleRoleChannelHours
) => {
	// Setup an object to return with all the info we might need later
	const obj = {
		isValid: true,
		days: [],
		friendlyDays: [],
		time: '',
		timezone: '',
		role: '',
		channel: '',
		err: [],
	}

	// Validate Days and build an array of day indices and an array of friendly day names in a standard format
	try {
		const daysOfWeek = days.toLowerCase().split(',')
		if (daysOfWeek.length > 7)
			throw new Error('There are only seven days in a week.')

		for (let i = 0; i < daysOfWeek.length; i++) {
			switch (daysOfWeek[i].trim()) {
				case 'monday':
				case 'mon':
				case 'm':
					if (daysOfWeek.includes(1)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
					daysOfWeek[i] = 1
					break
				case 'tuesday':
				case 'tues':
				case 't':
				case 'tu':
					if (daysOfWeek.includes(2)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
					daysOfWeek[i] = 2
					break
				case 'wednesday':
				case 'wed':
				case 'w':
					if (daysOfWeek.includes(3)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
					daysOfWeek[i] = 3
					break
				case 'thursday':
				case 'thurs':
				case 'th':
				case 'r':
					if (daysOfWeek.includes(4)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
					daysOfWeek[i] = 4
					break
				case 'friday':
				case 'fri':
				case 'f':
					if (daysOfWeek.includes(5)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
					daysOfWeek[i] = 5
					break
				case 'saturday':
				case 'sat':
				case 's':
					if (daysOfWeek.includes(6)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
					daysOfWeek[i] = 6
					break
				case 'sunday':
				case 'sun':
				case 'su':
				case 'u':
					if (daysOfWeek.includes(7)) {
						daysOfWeek.splice(i, 1) // Prevent duplicates
						i--
						break
					}
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
				'Invalid list of days submitted. Use a comma-delimited list of up to 7 days. For example, if your static raids on the weekends, use Sat,Sun.\n\n' +
				'>>> **Supported abbreviations:**\nSunday: Sun, SU, U\nMonday: Mon, M\nTuesday: Tues, TU, T\nWednesday: Wed, W\nThursday: Thurs, TH, R\nFriday: Fri, F\nSaturday: Sat, S',
		})
	}

	// Validate timeTZ
	const timeTZRgx = /^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M) ([A-Z]{2,3})$/g
	if (!timeTZRgx.test(timeTZ)) {
		obj.isValid = false
		obj.err.push({
			field: 'Time and timezone',
			message: 'Invalid time and timezone submitted. Use HH:mmAM/PM TZ. For example, if your raid start time is 8:30 PM Eastern, use 8:30PM EST.',
		})

		return obj // if we can't split timeTZ on the whitespace, we have to return as none of it can be validated
	}

	const time = timeTZ.split(' ')[0].trim()
	const timezone = timeTZ.split(' ')[1].trim()

	// Validate time
	const timeRgx = /^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/g
	if (!timeRgx.test(time)) {
		obj.isValid = false
		obj.err.push({
			field: 'Raid Start Time',
			message: 'Invalid time submitted. Use HH:mmAM/PM. For example, if your static starts raid at 8:30 PM, use 8:30PM.',
		})
	}

	obj.time = time

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

		// Validate role and channel are resolvable from the client
		const guild = await client.guilds.fetch(interaction.guildId)
		if (!guild)
			throw new Error('Unable to fetch the guild from the client')

		const role = await guild.roles.fetch(
			obj.role.substring(3, obj.role.length - 1)
		)
		if (!role) throw new Error('Unable to fetch the role from the client')

		const channel = await guild.channels.fetch(obj.channel)
		if (!channel)
			throw new Error('Unable to fetch the channel from the client')
	} catch (e) {
		obj.isValid = false
		obj.err.push({
			field: 'Role, Channel, Hours',
			message: 'An error occurred while processing the Role, Channel, Hours field. When submitting the Raid Reminder form, **DO NOT change the Role, Channel, Hours field**',
		})
	}

	return obj
}
