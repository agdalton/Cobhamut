// Ask the Magic 8 ball a question and receive a random answer

const reply = require('../../../.util/command-utils/interaction-reply.js')

module.exports = async (interaction, data, globals) => {
	const embed = new DiscordJS.MessageEmbed()
		.setColor('#9c59b6')
		.setAuthor(
			client.user.username,
			`${baseImageURL}/avatars/${client.user.id}/${client.user.avatar}.png`
		)
	embed.addField('Question', commandArgs.question)
	embed.addField('Answer', getMagicAnswer(Math.floor(Math.random() * 20)))

	reply(DiscordJS, client, interaction, embed)
}
