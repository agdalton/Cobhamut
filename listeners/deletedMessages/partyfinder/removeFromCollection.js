const partyfinderSchema = require('../../../.util/mongo-utils/partyfinder/partyfinderSchema')

// Remove deleted messages from the MongoDB collection
module.exports = {
	callback: async (message) => {
		if (!message.hasOwnProperty('id')) return

		const query = { originalResponseID: message.id }
		await partyfinderSchema.deleteMany(query)
	},
}
