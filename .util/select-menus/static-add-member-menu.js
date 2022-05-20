/*
Process selectMenu for /static add-member
*/

module.exports = {
	name: 'static-add-member-menu',
	callback: async (client, interaction, globals) => {
        const { lunar_white } = globals
        const options = interaction.values[0].split(',')
        const static = options[0]
        const new_member = {
            user: options[1],
            job: options[2],
            bis_url: '',
            bis_id: ''
        }

        console.log(new_member)
        return
    },
}
