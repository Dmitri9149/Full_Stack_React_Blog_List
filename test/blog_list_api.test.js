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


test('after post- addition of a blog ,the length increase by 1', async () => {
  const response_before = await api.get('/api/blogs')
  const length_before = response_before.body.length

  const newBlog = {
    title: 'async/await simplifies making async calls',
    likes: 10,
    author: "full_stack",
    url:"some_url"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response_after = await api.get('/api/blogs')
  const titles = response_after.body.map(x => x.title)

  expect(response_after.body).toHaveLength(length_before + 1)
  expect(titles).toContain('async/await simplifies making async calls')
 
})

test('if likes is not defined in post- , it will be 0', async () => {
  const response_before = await api.get('/api/blogs')
  const length_before = response_before.body.length

  const newBlog = {
    title: 'test for default of likes',
    author: "full_stack",
    url:"some_url"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response_after = await api.get('/api/blogs')
  const titles = response_after.body.map(x => x.title)
  const likes = response_after.body.map(x => x.likes)

  expect(response_after.body).toHaveLength(length_before + 1)
  expect(titles).toContain('test for default of likes')
  expect(likes[length_before]).toBe(0)
 
})

afterAll(() => {
  mongoose.connection.close()
})