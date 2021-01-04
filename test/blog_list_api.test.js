const { response } = require('express')
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

/*
test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})
*/

test('the returned name of id is "id', async () => {
  const response = await api.get('/api/blogs')
  console.log('response', response.body)
  const id = response.body[0].id
  console.log('id', id)
  expect(id).toBeDefined()

})

/*
test('after post- addition of a blog ,the length increase by 1', async () => {
  const response_before = await api.get('/api/blogs')
  const length_before = length(response_before)



  expect(response.body).toHaveLength(2)
})
*/


afterAll(() => {
  mongoose.connection.close()
})