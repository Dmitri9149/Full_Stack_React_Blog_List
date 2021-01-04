const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the returned "id" is "id', async () => {
  const response = api.get('api/blogs')
  const id = response[0].id
  expect(id).toBeDefined()

})

afterAll(() => {
  mongoose.connection.close()
})