const UsersBusinessesService = {
  getAllUsersBusinesses(knex) {
    return knex
      .select('*')
      .from('user_businesses') 
  },

  postBusiness(knex, newBusiness) {
    return knex
      .insert(newBusiness)
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