const UserBusinessesService = {
	storeBusinessWithUser(db, userId, businessId) {
		console.log(userId)
		console.log(businessId)
		return db
      .insert(userId, businessId)
      .returning('*')
      .into('user_businesses')
      //.then(([rows]) => rows)
	},

	getBusinessId(db, businessId) { 
    return db('business')
      .where(businessId)
      .first()
      .then(res => res.id)
  },
}

module.exports = UserBusinessesService