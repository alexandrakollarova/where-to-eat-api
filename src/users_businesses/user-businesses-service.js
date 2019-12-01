const UserBusinessesService = {
	storeBusinessWithUser(db, userId, businessId) {
		console.log(userId)
		console.log(businessId)
		return db
			.insert(userId, businessId)
			.into('user_businesses')
			.returning('*')
			.then(([rows]) => rows)
	},

	getBusinessId(db, businessId) { 
    return db('business')
      .where(businessId)
      .first()
      .then(res => res.id)
  },
}

module.exports = UserBusinessesService