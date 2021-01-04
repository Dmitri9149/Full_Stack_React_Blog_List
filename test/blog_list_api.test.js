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
  const response = api.get('/api/blogs')
  console.log('response', response)
  const id = response.body[0].id
  console.log('id', id)
  expect(id).toBeDefined()

})


afterAll(() => {
  mongoose.connection.close()
})