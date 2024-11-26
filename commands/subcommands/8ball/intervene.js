// Don't like what the Magic 8 ball answered? Try and get a more favorable answer!
const { EmbedBuilder } = require('discord.js')
const reply = require('../../../.util/command-utils/interactionReply.js')
const getAnswer = require('../../../.util/command-utils/8ball/getAnswer.js')

module.exports = async (interaction, data, globals) => {
	const { last8BallQuestion, baseImageURL } = globals
	const { gold } = globals.colors
	const { memberID, memberUsername, memberNick, memberAvatar } = data
	const intervene = Math.floor(Math.random() * 100) >= 90 ? true : false // True 10% of the time
	const interventionType = interaction.options.getString('type')
	let lastInteraction = last8BallQuestion.interaction
	let lastQuestion = last8BallQuestion.question

	// Return if no previous question has been recorded
	if (!lastInteraction || !lastQuestion) {
		reply(
			interaction,
			'No question has been asked.',
			null,
			null,
			false,
			false
		)
		return
	}

	// Return 90% of the time
	if (!intervene) {
		reply(
			interaction,
			'I see no better outcome.',
			null,
			null,
			false,
			false
		)
		return
	}

	// Find the new answer
	const rand = Math.floor(Math.random() * 10)
	const answer =
		interventionType == 'good' ? getAnswer(rand) : getAnswer(rand + 10)

	// Setup intervention embed
	const embed = new EmbedBuilder()
		.setColor(gold)
		.setThumbnail('https://i.imgur.com/cmRBCbp.png')
		.addFields(
			{ name: 'Question', value: lastQuestion },
			{ name: 'Answer', value: answer }
		)
		.setFooter({
			text:
				(memberNick ? memberNick : memberUsername) +
				' used Divine Intervention!',
			iconURL: `${baseImageURL}/avatars/${memberID}/${memberAvatar}`,
		})

	// Edit the original reply with the newly intervened reply and let the person who intervened know it worked
	reply(lastInteraction, null, [embed], null, false, true)
	reply(interaction, 'I have granted your wish!', null, null, false, false)
	return
}
