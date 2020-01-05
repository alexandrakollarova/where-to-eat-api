const UserBusinessesService = {
  getUsersBusinessesId(db, userId) {
    return db
      .select('*')
      .from('user_businesses')
      .where("user_id", userId)
      .then(rows => {
        return db
          .select('*')
          .from('business')
          .whereIn('id', rows.map(row => row.business_id))
      })
  },

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

  deleteBusinessFromUser(db, businessId) {
    return db
      .from('user_businesses')
      .where({
        business_id: businessId
      })
      .delete()
  }
}

module.exports = UserBusinessesService