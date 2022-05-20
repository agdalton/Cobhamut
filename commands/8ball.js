/*
    Ask the magic 8 ball a question.
    This command takes a text input,
    picks an answer from an array of 20 items,
    and returns that answer in a MessageEmbed.

*/
const requestAPI = require('request')

module.exports = {
	guildId: '',
	callback: async (client, interaction, globals) => {
		const data = {
			username: interaction.member.user.username,
			nick: interaction.member.nick,
			baseImageURL: 'htps://cdn.discordapp.com'
		}

		// process /8ball ask
		if (command === 'ask') {
			
		}

		// process /8ball intervene
		if (command === 'intervene') {
			let lastInteractionId = ''
			let lastInteractionToken = ''
			let lastQuestion = ''

			for (const command of recentCommands) {
				// find last question asked
				if (command.command === 'ask') {
					lastInteractionId = command.lastInteractionId || ''
					lastInteractionToken =
						command.lastInteractionToken || ''
					lastQuestion = command.lastArgs.question || ''
				}
			}
			if (lastInteractionId && lastInteractionToken && lastQuestion) {
				let outcomeMessage = 'I see no better outcome.'
				const embed = new DiscordJS.MessageEmbed()
					.setColor('#f1c40f')
					.setAuthor(
						client.user.username,
						`${baseImageURL}/avatars/${client.user.id}/${client.user.avatar}.png`
					)

				if (Math.floor(Math.random() * 100) >= 90) {
					outcomeMessage = 'I have granted your wish!'
					embed.addField('Question', lastQuestion)

					if (commandArgs.type === 'good') {
						embed.addField(
							'Answer',
							getMagicAnswer(
								Math.floor(Math.random() * 10)
							)
						)
					} else if (commandArgs.type === 'bad') {
						embed.addField(
							'Answer',
							getMagicAnswer(
								Math.floor(Math.random() * 10) + 10
							)
						)
					}

					embed.setFooter(
						(nick ? nick : username) +
							' used Divine Intervention!',
						'https://emoji.gg/assets/emoji/7763_dogerime.png'
					)
					const data = await createAPIMessage(
						DiscordJS,
						client,
						interaction,
						embed
					)
					const APIoptions = {
						url: `https://discord.com/api/v8/webhooks/${client.user.id}/${lastInteractionToken}/messages/@original`,
						json: true,
						body: data,
						headers: {
							Authorization: process.env.EIGHTBALL_TOKEN,
						},
					}

					requestAPI.patch(APIoptions, (err, res, body) => {
						if (err) {
							reply(
								DiscordJS,
								client,
								interaction,
								'There was an error running this command.'
							)
						} else {
							reply(
								DiscordJS,
								client,
								interaction,
								outcomeMessage
							)
							new DiscordJS.WebhookClient(
								client.user.id,
								lastInteractionToken
							).send(data)
						}
					})
				} else {
					reply(DiscordJS, client, interaction, outcomeMessage)
				}
			} else {
				reply(
					DiscordJS,
					client,
					interaction,
					'No question has been asked.'
				)
			}
		}

		return
	},
	data: {
		name: '8ball',
		description: 'Ask a question or seek Divine Intervention!',
		options: [
			{
				name: 'ask',
				description: 'Ask the Magic 8 ball',
				type: 1, // subcommand
				options: [
					{
						name: 'question',
						description: 'What do you seek an answer to?',
						type: 3, // String
						required: true,
					},
				],
			},
			{
				name: 'intervene',
				description:
					'Seek divine intervention and ask the Magic 8 ball to change the outcome of the last question',
				type: 1, // subcommand
				options: [
					{
						name: 'type',
						description:
							'What kind of intervention are you seeking?',
						required: true,
						type: 3, // string
						choices: [
							{
								name: 'Good',
								value: 'good',
							},
							{
								name: 'Bad',
								value: 'bad',
							},
						],
					},
				],
			},
		],
	},
}
/* --- --- module methods --- --- */
const reply = async (DiscordJS, client, interaction, response) => {
	let data = {
		content: response,
	}
	// check embed
	if (typeof response === 'object') {
		data = await createAPIMessage(
			DiscordJS,
			client,
			interaction,
			response
		)
	}
	// send the reply
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data,
		},
	})

	return
}

const createAPIMessage = async (DiscordJS, client, interaction, content) => {
	// -- build API message for use with embeds, etc --
	const { data, files } = await DiscordJS.APIMessage.create(
		client.channels.resolve(interaction.channel_id),
		content
	)
		.resolveData()
		.resolveFiles()

	return { ...data, files }
}

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
