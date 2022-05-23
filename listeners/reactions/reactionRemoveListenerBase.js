// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableEmoji, callback } = reactionListener
	console.log('Remove fired!')
	client.on('messageReactionRemove', (reaction, user) => {
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, true, globals)

		return
	})
}
