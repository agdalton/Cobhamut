// Ask the Magic 8 ball a question and receive a random answer

const interaction_reply = require('../../../.util/command-utils/interaction-reply.js')

module.exports = async (interaction, data, globals) => {
	const { baseImageURL } = data
	const { clientID, clientUsername, clientAvatar, lunar_purple } = globals
	const question = interaction.options.getString('question')

	const embed = new DiscordJS.MessageEmbed()
		.setColor(lunar_purple)
		.setAuthor(
			clientUsername,
			`${baseImageURL}/avatars/${clientID}/${clientAvatar}.png`
		)
		.setThumbnail('https://imgur.com/cmRBCbp')
		.addField('Question', question)
		.addField('Answer', getMagicAnswer(Math.floor(Math.random() * 20)))

	interaction_reply(interaction, null, [embed], null, false)
}

// Module methods //
const getMagicAnswer = (index) => {
	const possibleAnswers = [
		'It is certain.',
		'It is decidedly so.',
		'Without a doubt.',
		'Yes definitely.',
		'You may rely on it.',
		'As I see it, yes.',
		'Most likely.',
		'Outlook good.',
		'Yes.',
		'Signs point to yes.',
		'Reply hazy, try again.',
		'Ask again later.',
		'Better not tell you now.',
		'Cannot predict now.',
		'Concentrate and ask again.',
		"Don't count on it.",
		'My reply is no.',
		'My sources say no.',
		'Outlook not so good.',
		'Very doubtful.',
	]

	return possibleAnswers[index]
}
