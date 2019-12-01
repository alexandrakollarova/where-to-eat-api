const UserBusinessesService = {
	saveBusinessWithUser(db, userId, businessId) {
		return db
		.insert({
			user_id: userId,
			business_id: businessId
		})
      .returning('*')
      .into('user_businesses')
	},

	getBusinessId(db, businessId) { 
    return db('business')
      .where(businessId)
      .first()
	},
	
	deleteBusinessFromUser(db, userId, businessId) {
    return db
      .from('user_businesses')
      .where(userId, businessId)
			.del()
	}
}

module.exports = UserBusinessesService