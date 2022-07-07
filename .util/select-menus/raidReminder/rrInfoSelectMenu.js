const { MessageEmbed } = require('discord.js')
const { DateTime } = require('luxon')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')
const interactionReply = require('../../command-utils/interactionReply')
const getNextReminder = require('../../command-utils/raidReminder/getNextReminder.js')

module.exports = {
	name: 'rrInfoSelectMenu',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { red, purple } = globals.colors

		// Get select menu value
		const selectedItem = interaction.values[0]

		// Get data about the user who submitted the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Create embed reply
		const embed = new MessageEmbed().setTitle('Raid reminder info')

		// Get the reminder
		const reminder = await raidReminderSchema.findOne({
			_id: selectedItem,
		})
		const {
			title,
			days,
			time,
            timezone,
			friendlyTZ,
			role,
			channel,
			reminderHours,
		} = JSON.parse(reminder.dataSubmission)

		if (reminder.length === 0) {
			embed.setColor(red)
				.setDescription(
					"Unable to retrieve the raid reminder's information."
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
		const nextReminder = getNextReminder(
			days,
			time,
			timezone,
			reminderHours
		)
		const nextReminderDate = nextReminder.toLocaleString(
			DateTime.DATE_MED_WITH_WEEKDAY
		)

		embed.setColor(purple)
			.setDescription(
				'Retrieved the below information about this raid reminder.'
			)
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.addField('Title', title)
			.addField('Static', role)
			.addField(
				'Raid start time',
				`${time} ${friendlyTZ} | ${reminderHours} hour reminder`,
				true
			)
			.addField('Raid days', days.join(), true)
			.addField('\u200b', '\u200b', true)
			.addField(
				'Next reminder',
				`${nextReminderDate.substring(
					0,
					nextReminderDate.length - 6
				)} ${nextReminder.toLocaleString(DateTime.TIME_SIMPLE)} ${
					nextReminder.offsetNameShort
				}`,
				true
			)
			.addField('Channel', `<#${channel}>`, true)
            .addField('\u200b', '\u200b', true)
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
