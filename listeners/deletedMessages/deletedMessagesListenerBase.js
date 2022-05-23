// Message delete listener <-- executes when a message is deleted

module.exports = async (client, reactionListener, globals) => {
	let { callback } = reactionListener
	client.on('messageDelete', async (message) => {
		callback(message, globals)

		return
	})
}
