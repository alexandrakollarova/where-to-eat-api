const UsersBusinessesService = {
  getAllUsersBusinesses(knex) {
    return knex
      .select('*')
      .from('user_businesses') 
  },

  postBusiness(knex, userId, businessId) { console.log(userId, businessId)
    return knex
      .insert(userId, businessId)
      .into('user_businesses')
      .returning('*')
      .then(rows => rows[0])
  },

  deleteBusiness(knex, id) {
    return knex('user_businesses')
      .where({id})
      .delete()
  }
}

module.exports = UsersBusinessesService