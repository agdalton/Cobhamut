// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableEmoji, callback } = reactionListener

	client.on('messageReactionAdd', (reaction, user) => {
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, false, globals)

		return
	})

	client.on('messageReactionRemove', (reaction, user) => {
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, true, globals)

		return
	})
}
