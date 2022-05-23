// Message delete listener <-- executes when a message is deleted

module.exports = async (client, reactionListener, globals) => {
	let { callback } = reactionListener
	client.on('messaegDelete', async (message) => {
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(message, globals)

		return
	})
}
