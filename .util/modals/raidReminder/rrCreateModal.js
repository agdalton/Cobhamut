const { data } = require('../../../commands/raidReminder')
const interactionReply = require('../../command-utils/interactionReply')
const getNextReminder = require('../../command-utils/raidReminder/getNextReminder')
const sendInputError = require('../../command-utils/raidReminder/sendInputError')
const validateInputs = require('../../command-utils/raidReminder/validateInputs')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema')

// Respond to the create raid reminder command and create the reminder in MongoDB
module.exports = {
	name: 'rrCreateModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { purple } = globals.colors

		// Setup member data to pass as necessary <-- this is data about the person who sent the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Get modal inputs
		const { fields } = interaction
		const message = fields.getTextInputValue('rrMessage').trim()
		const days = fields.getTextInputValue('rrDays').trim()
		const time = fields.getTextInputValue('rrTime').trim()
		const timezone = fields
			.getTextInputValue('rrTimezone')
			.trim()
			.toUpperCase()
		const roleAndChannel = fields
			.getTextInputValue('rrRoleAndChannel')
			.trim()

		// Validate time and timezone
		const inputs = validateInputs(days, time, timezone, roleAndChannel)

		if (!inputs.isValid) {
			sendInputError(interaction, memberData, globals, inputs)
			return
		}

		// Get the date of the next reminder to be sent
		const nextReminder = getNextReminder(inputs.days, time, timezone)

		// Create the reminder in MongoDB
		await new raidReminderSchema({
			nextReminder: nextReminder, // ISODate of when the next reminder should be sent
			reminderChannel: inputs.channel,
			mentionRole: inputs.role,
			dataCreator: JSON.stringify(memberData), // JSON.stringify() object containing data about the user who ran the command creating the raidReminder
			dataSubmission: JSON.stringify({
				message: message,
				days: inputs.days,
				time: time,
				timezone: timezone,
				role: inputs.role,
				channel: inputs.channel,
			}), // JSON.stringify() object containing data about the command submission
			guildID: interaction.guildId, // Discord server ID of the server the command was sent from
			channelID: interaction.channelId, // Discord channel ID of the channel the command was sent from
		}).save()

		interactionReply(
			interaction,
			`Your reminder has been scheduled! The next reminder will be sent on ${nextReminder.toLocaleString(
				DateTime.DATE_MED_WITH_WEEKDAY
			)} at ${nextReminder.toLcaleString(DateTime.TIME_SIMPLE)} ${
				nextReminder.offsetNameShort
			}`,
			null,
			null,
			true,
			false
		)
	},
}
