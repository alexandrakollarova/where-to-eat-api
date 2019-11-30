const UsersBusinessesService = {
  getAllUsersBusinesses(knex) {
    return knex
      .select('*')
      .from('user_businesses') 
  },

  postBusiness(knex, userId, businessId) {
    return knex
      .insert(businessId)
      .into('business')
      .returning('*')
      .then(rows => { 
        return rows[0]
      })
  },

  deleteBusiness(knex, id) {
    return knex('user_businesses')
      .where({id})
      .delete()
  }
}

module.exports = UsersBusinessesService