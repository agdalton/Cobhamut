// Return the ISO date of the next reminder to be sent
const { DateTime } = require('luxon')

module.exports = (days, time, timezone, reminderHours) => {
	// Right now
	const dtNow = DateTime.now().setZone(timezone)
	const today = dtNow.weekday

	// Grab 24hr time for Luxon DateTime
	const meridiem = time.substring(time.length - 2) // AM/PM
	const arrTime = time.slice(0, -2).split(':') // [0] is hour [1] is minutes

	// Convert hours and minutes to integers
	let hour = parseInt(arrTime[0]) // HH:mm index 0 of split is HH
	let minute = parseInt(arrTime[1]) // HH:mm index 1 of split is mm

	// Add 12 hours to account for 24hr clock used by Luxon
	if (meridiem === 'PM') hour += 12

	// Fix 12:00AM for 24hr clock
	if (meridiem === 'AM' && hour === 12) hour = 0

	// Time the raid should start, if it were today
	const nextReminder = DateTime.fromObject(
		{
			year: dtNow.year,
			month: dtNow.month,
			day: dtNow.day,
			hour: hour,
			minute: minute,
			second: 0,
		},
		{ zone: timezone }
	)

	// Check if a reminder should be scheduled for today
	if (days.includes(today)) {
		if (
			dtNow.toUnixInteger() + 1 <
			nextReminder.minus({ hours: reminderHours }).toUnixInteger()
		)
			return nextReminder.minus({ hours: reminderHours })
		else if (days.length === 1) return nextReminder.plus({ days: 7 })
	}

	// Otherwise find the next day a reminder should be sent
	for (let i = 0; i < days.length; i++) {
		if (days[i] > today) {
			const expectedReminder = nextReminder
				.plus({
					days: days[i] - today,
				})
				.minus({ hours: reminderHours })

			if (dtNow.toUnixInteger() + 1 < expectedReminder.toUnixInteger())
				return expectedReminder
			else if (days.length === 1)
				return expectedReminder.plus({ days: 7 })
		}
	}

	// Find the next reminder if the next day is a lower index in the week

	/* Since the next reminder is on a day preceding today in the future
	 * (i.e. today's Saturday, but the next reminder is Tuesday which is earlier in the week)
	 * we need to find how many days it is until Sunday (Luxon DateTime weekday index 7) and then add
	 * the necessary number of days to the Luxon DateTime. The day index is the number of days into the week
	 * that particular day is, so subtracting today's index from 7 and then adding the index for the day
	 * the next reminder should be sent on will return the correct date.
	 */
	let nextDayIndex = today
	for (let i = 0; i < days.length; i++) {
		if (days[i] < today) {
			nextDayIndex = days[i]
			const expectedReminder = nextReminder
				.plus({
					days: 7 - today + nextDayIndex,
				})
				.minus({ hours: reminderHours })

			if (dtNow.toUnixInteger() + 1 < expectedReminder.toUnixInteger())
				return expectedReminder

			nextDayIndex = today
		}
	}

	return
}
