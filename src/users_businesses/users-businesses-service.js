const UsersBusinessesService = {
  getAllBusinesses(db) {
    return db
      .from('business')
      .select('*') 
  },

  hasBusinessWithSameId(db, businessId) { 
    return db('business')
      .where(businessId)
      .first()
      .then(id => !!id)
  },

  postBusiness(db, businessId) {
    return db
      .insert(businessId)
      .into('business')
      .returning('*')
      .then(([rows]) => rows)
  },

  updateExistingBusiness(db, businessId) {
    return db('business')
      .where(businessId)
      .update(businessId)
  },

  deleteBusiness(db, businessId) {
    return db
      .from('business')
      .where(businessId)
      .del()
  }
}

module.exports = UsersBusinessesService