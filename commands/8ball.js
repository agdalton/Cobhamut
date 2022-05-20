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
		const command = interaction.options.getSubcommand()
		const data = {
			username: interaction.member.user.username,
			nick: interaction.member.nick,
			baseImageURL: 'htps://cdn.discordapp.com',
		}

		require(`./subcommands/${interaction.commandName}/${command}.js`)(
			interaction,
			data,
			globals
		)

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
	data: (() => {
		// Primary command settings
		const data = new SlashCommandBuilder()
		data.setName('8ball')
		data.setDescription('Ask a question or seek Divine Intervention!')

		// Ask subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('ask')
				.setDescription('Ask the Magic 8 ball')
				.addStringOption((option) =>
					option
						.setName('question')
						.setDescription('What do you seek an answer to?')
						.setRequired(true)
				)
		)

		// Intervene subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('intervene')
				.setDescription(
					'Seek divine intervention and ask the Magic 8 ball to change the outcome of the last question'
				)
				.addStringOption((option) =>
					option
						.setName('type')
						.setDescription(
							'What kind of intervention are you seeking?'
						)
						.addChoice('Good', 'good')
						.addChoice('Bad', 'bad')
						.setRequired(true)
				)
		)
	}),
}
/* --- --- module methods --- --- */
const updateRecents = (interaction, command, commandArgs, recentCommands) => {
	for (const command of recentCommands) {
		if (command === recentCommands.command) {
			recentCommands.lastInteractionId = interaction.id
			recentCommands.lastInteractionToken = interaction.token
			recentCommands.lastArgs = commandArgs
			return
		}
	}
	recentCommands.push({
		command: command,
		lastInteractionId: interaction.id,
		lastInteractionToken: interaction.token,
		lastArgs: commandArgs,
	})
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