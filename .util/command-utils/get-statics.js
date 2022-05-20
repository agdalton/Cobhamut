/*
Util for getting all the statics in a server
*/
const node_pg_query = require('./node-pg-query.js')

module.exports = async (guildId) => {
	try {
		const data = await node_pg_query(
			'SELECT data FROM discord_servers WHERE server_id = $1',
			[guildId]
		)
        // make sure statics exists
		if (typeof data === 'object' && data.hasOwnProperty('statics')) {
            return data.statics
		}

        throw ('error')
	} catch (e) {
		return ['Unable to retrieve any statics for this server']
	}
}
