// Reaction listener <-- executes when an interaction is messageReactionAdd

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

	client.on('messageReactionRemove', (reaction, user) => {
		if (
			applicableMessages.includes(reaction.message.id) &&
			applicableEmoji.includes(reaction._emoji.id)
		)
			callback(reaction, user, true, globals)

		return
	})
}
