const { MessageEmbed } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')
const interactionReply = require('../../command-utils/interactionReply')

module.exports = {
	name: 'rrCancelModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { orange, purple } = globals.colors

		// Get modal inputs
		const { fields } = interaction
		const mongoId = fields.getTextInputValue('rrMongoId').trim()
		const confirmation = fields.getTextInputValue('rrConfirm').trim()

		// Get data about the user who submitted the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Create embed reply
		const embed = new MessageEmbed()

		// Return if the user didn't correctly type CANCEL
		if (confirmation !== 'CANCEL') {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'Invalid confirmation from the cancel dialog. To cancel a raid reminder, type "CANCEL" (in all caps) into the cancelation dialog when prompted.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder cancel`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})

			interactionReply(interaction, null, [embed], null, true, false)
			return
		}

		// Delete the reminder from mongoDB
		try {
			await raidReminderSchema.deleteOne({
				_id: mongoId,
			})
		} catch (e) {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'An error occurred while trying to cancel this reminder. It has **NOT** been canceled.\n\nWhen interacting with the cancelation dialog, **DO NOT change the Reminder ID field**.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder cancel`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})

			interactionReply(interaction, null, [embed], null, true, false)
			return
		}

		// Respond with delete confirmation
		embed.setTitle('Cancel a raid reminder')
			.setColor(purple)
			.setDescription(
				'Your raid reminder has been canceled successfully.'
			)
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder cancel`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		interactionReply(interaction, null, [embed], null, true, false)
		return
	},
}
