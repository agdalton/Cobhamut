// Return the ISO date of the next reminder to be sent
const { DateTime } = require('luxon')

module.exports = (days, time, timezone) => {
	// Right now
	const dtNow = DateTime.now().setZone(timezone, { keepLocalTime: true })
	const today = dtNow.weekday
	// Time the raid should start, if it were today
	const nextReminder = DateTime.now()
		.set({
			hour: time.split(':')[0],
			minute: time.split(':')[1],
		})
		.setZone(timezone, { keepLocalTime: true })

	// Check if a reminder should be scheduled for today
	if (days.includes(today))
		if (dtNow < nextReminder) return nextReminder.toISO()

	// Otherwise find the next day a reminder should be sent
	for (let i = 0; i < days.length; i++) {
		if (days[i] > today)
			return nextReminder.plus({ days: days[i] - today })
	}

	// Find the next reminder if the next day is a lower index in the week
	let nextDayIndex = today
	for (let i = 0; i < days.length; i++) {
		if (days[i] < nextDayIndex) nextDayIndex = days[i]
	}

	/* Since the next reminder is on a day preceding today in the future
	 * (i.e. today's Saturday, but the next reminder is Tuesday which is earlier in the week)
	 * we need to find how many days it is until Sunday (Luxon DateTime weekday index 7) and then add
	 * the necessary number of days to the Luxon DateTime. The day index is the number of days into the week
     * that particular day is, so subtracting today's index from 7 and then adding the index for the day
     * the next reminder should be sent on will return the correct date.
	 */
	return nextReminder.plus({ days: 7 - today + nextDayIndex })
}
