// Reaction listener <-- executes when an interaction is messageReactionAdd

const { Client } = require('discord.js')

module.exports = async (client, reactionListener, globals) => {
	let { applicableMessages, applicableEmoji, callback } = reactionListener
	let message = ''

	client.on('messageReactionAdd', (reaction, user) => {
		if (
			applicableMessages.includes(reaction.message.id) &&
			applicableEmoji.includes(reaction._emoji.id)
		)
			callback(message, reaction, user, false, globals)

		return
	})

	Client.on('messageReactionRemove', (reaction, user) => {
		if (
			applicableMessages.includes(reaction.message.id) &&
			applicableEmoji.includes(reaction._emoji.id)
		)
			callback(reaction, user, true, globals)

		return
	})
}
