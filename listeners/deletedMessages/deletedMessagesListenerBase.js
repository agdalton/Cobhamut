// Message delete listener <-- executes when a message is deleted

module.exports = async (client, deletedMessagesListener, globals) => {
	let { callback } = deletedMessagesListener
	client.on('messageDelete', (message) => {
		callback(message, globals)

		return
	})
}
