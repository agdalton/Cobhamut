// Check if a role is full for partyfinder
module.exports = (role, dataUserRSVP, dataPartyComp, dataTotalRSVP) => {
	// If fill was selected, compare to total number of RSVP
	console.log(role)
	const numRole = (role === 'fill' ? dataTotalRSVP : dataUserRSVP[role])
	const limit = (role === 'fill' ? dataTotalRSVP : dataPartyComp[role])
	let answer = false

	if (numRole === limit) answer = true

	console.log(answer)
	return answer
}
