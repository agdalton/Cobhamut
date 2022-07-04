// Return the ISO date of the next reminder to be sent
const { DateTime } = require('luxon')

module.exports = (days, time, timezone) => {
	const dtNow = DateTime.now().setZone(timezone, { keepLocalTime: true })

	// Check if a reminder should be scheduled for today
	if (days.includes(dtNow.weekday)) {
		const rrToday =
			dtNow <
			DateTime.now()
				.set({
					hour: time.split(':')[0],
					minute: time.split(':')[1],
				})
				.setZone(timezone, { keepLocalTime: true })
	}
}
