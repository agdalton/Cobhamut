// Check if a role is full for partyfinder
module.exports = (
	role,
	dataUserRSVP,
	dataPartyComp,
	partySize,
	dataTotalRSVP
) => {
	// If fill was selected, compare to total number of RSVP instead of maximum number per role
	const numRole = role === 'fill' ? dataTotalRSVP : dataUserRSVP[role].length
	const limit = role === 'fill' ? partySize : dataPartyComp[role]
	let answer = false

	if (numRole === limit) answer = true

	return answer
}
