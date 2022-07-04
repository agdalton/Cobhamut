// Return the ISO date of the next reminder to be sent
const { DateTime } = require('luxon')

module.exports = (days, time, timezone) => {
	// Right now
	const dtNow = DateTime.now().setZone(timezone, { keepLocalTime: true })
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
	const nextReminder = DateTime.now()
		.set({
			hour: hour,
			minute: minute,
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