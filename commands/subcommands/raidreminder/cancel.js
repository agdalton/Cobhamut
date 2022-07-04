// Retrieve a list of raid reminders created by the user and present an option to delete a selection
const { raidReminderSchema } = require('../../../.util/mongo-utils/raidReminder/raidReminderSchema.js')
module.exports = async (interaction, data, globals) => {
	// Destruct globals
	const {} = globals
	const {} = globals.colors

	// Setup member data to pass as necessary <-- this is data about the person who sent the command
	const memberData = {
		memberID: interaction.member.user.id,
		memberUsername: interaction.member.user.username,
		memberNick: interaction.member.nickname,
		memberAvatar: interaction.member.user.avatar,
	}

    // Find all raid reminders scheduled by the user
    const raidReminders = raidReminderSchema.find()
}
