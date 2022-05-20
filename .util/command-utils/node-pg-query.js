/*
Reusable utility for querying the PostgreSQL database on Heroku
*/
const { Pool } = require('pg')

module.exports = async (query, values) => {
	// setup postgres connection
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	})
	let res = ''
	try {
		const client = await pool.connect()
		res = await pool.query(query, values)
		client.release()
		if (!res || !res.rows || !res.rows.length || !res.rows[0].data) return
		return res.rows[0].data
	} catch (err) {
		console.error(err)
		return
	}
}
