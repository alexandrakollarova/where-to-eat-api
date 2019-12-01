const BusinessService = {
  checkForDuplicates(db, businessId) {
    return db("business")
      .where(businessId)
      .first()
      .then(id => !!id);
  },

  saveBusiness(db, businessId) {
    return db
      .insert(businessId)
      .into("business")
      .returning("*")
      .then(([rows]) => rows);
  },

  updateExistingBusiness(db, businessId) {
    return db("business")
      .where(businessId)
      .update(businessId);
  }
};

module.exports = BusinessService;
