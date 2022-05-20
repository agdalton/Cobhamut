// Ask the Magic 8 ball a question and receive a random answer
const { MessageEmbed } = require('discord.js')
const interaction_reply = require('../../../.util/command-utils/interaction-reply.js')
const get_answer = require('../../../.util/command-utils/get-magic-answer.js')

module.exports = async (interaction, data, globals) => {
	const { baseImageURL } = data
	const { clientID, clientUsername, clientAvatar, lunar_purple } = globals

	const question = interaction.options.getString('question')

	const embed = new MessageEmbed()
		.setColor(lunar_purple)
		.setAuthor({
			name: clientUsername,
			iconURL: `${baseImageURL}/avatars/${clientID}/${clientAvatar}.png`,
		})
		.setThumbnail('https://imgur.com/cmRBCbp')
		.addField('Question', question)
		.addField('Answer', get_answer(Math.floor(Math.random() * 20)))

	interaction_reply(interaction, null, [embed], null, false, false)

	// Record the question asked for future intervention
	globals.last8BallQuestion.interaction = interaction
	globals.last8BallQuestion.question = question
	return
}
