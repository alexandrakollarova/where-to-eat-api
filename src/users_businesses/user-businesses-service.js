const UserBusinessesService = {
	storeBusinessWithUser(db, userId, businessId) {
		return db
		.insert({
			business_id: businessId,
			user_id: userId
		})
      .returning('*')
      .into('user_businesses')
	},

	getBusinessId(db, businessId) { 
    return db('business')
      .where(businessId)
      .first()
      .then(res => res.id)
	},
	
	deleteBusiness(db, userId, businessId) {
    return db
      .from('user_businesses')
      .where(userId, businessId)
			.del()
	}
}

module.exports = UserBusinessesService