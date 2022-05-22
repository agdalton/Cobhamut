// Get party comp for partyfinder command
module.exports = (size) => {
	const comp = new Object()

	switch (size) {
		case '4':
			comp.tanks = 1
			comp.healers = 1
			comp.dps = 2
			break
		case '8':
			comp.tanks = 2
			comp.healers = 2
			comp.dps = 4
			break
		case '24':
			comp.tanks = 3
			comp.healers = 6
			comp.dps = 15
			break
		default:
			comp.err = {
				field: 'Party size',
				message: 'Invalid Pary size specified. Accepted values are 4, 8, 24.',
			}
	}

	return comp
}