// Message delete listener <-- executes when a message is deleted

module.exports = async (client, deletedMessagesListener, globals) => {
	let { callback } = deletedMessagesListener
	client.on('messageDelete', async (message) => {
		console.log('Message deleted!')
		callback(message, globals)

		return
	})
}
