const app = require('../src/app')

describe('Businesses Endpoint', () => {
  it.skip(`responds with 200 required when lat and long provided`, () => { 
    let coords = {
      lat: 29.311761,
      long: 47.873304
    }

    return supertest(app)
      .get(`/api/businesses?lat=${coords.lat}&long=${coords.long}`)
      .expect(200)
  })
})