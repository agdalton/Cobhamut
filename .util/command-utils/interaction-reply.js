/*
Reusable utility to reply to an interaction
*/
module.exports = async (interaction, content, embeds, components, ephemeral) => {
	await interaction.reply({
		content: content,
		embeds: embeds,
		components: components,
		ephemeral: ephemeral,
	})

	return
}
