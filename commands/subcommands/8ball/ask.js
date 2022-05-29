// Ask the Magic 8 ball a question and receive a random answer
const { MessageEmbed } = require('discord.js')
const reply = require('../../../.util/command-utils/interactionReply.js')
const getAnswer = require('../../../.util/command-utils/8ball/getAnswer.js')

module.exports = async (interaction, data, globals) => {
	const { memberID, memberUsername, memberNick, memberAvatar } = data
	const { baseImageURL } = globals
	const { purple } = globals.colors

	const question = interaction.options.getString('question')

	const embed = new MessageEmbed()
		.setColor(purple)
		.setThumbnail('https://i.imgur.com/cmRBCbp.png')
		.addField('Question', question)
		.addField('Answer', getAnswer(Math.floor(Math.random() * 20)))
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
