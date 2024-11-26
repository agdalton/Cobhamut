// Ask the Magic 8 ball a question and receive a random answer
const { EmbedBuilder } = require('discord.js')
const reply = require('../../../.util/command-utils/interactionReply.js')
const getAnswer = require('../../../.util/command-utils/8ball/getAnswer.js')

module.exports = async (interaction, data, globals) => {
	const { memberID, memberUsername, memberNick, memberAvatar } = data
	const { baseImageURL } = globals
	const { purple } = globals.colors

	const question = interaction.options.getString('question')
	const answer = getAnswer(Math.floor(Math.random() * 20))

	const embed = new EmbedBuilder()
		.setColor(purple)
		.setThumbnail('https://i.imgur.com/cmRBCbp.png')
		.addFields(
			{ name: 'Question', value: question },
			{ name: 'Answer', value: answer }
		)
		.setFooter({
			text:
				(memberNick ? memberNick : memberUsername) +
				' asked the Magic 8 Ball!',
			iconURL: `${baseImageURL}/avatars/${memberID}/${memberAvatar}`,
		})

	reply(interaction, null, [embed], null, false, false)

	// Record the question asked for future intervention
	globals.last8BallQuestion.interaction = interaction
	globals.last8BallQuestion.question = question
	return
}
