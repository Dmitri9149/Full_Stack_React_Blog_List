const { response } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(listHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(listHelper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})  

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

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

test('blog without title and url is not added', async () => {

  const newBlog = {
    author: 'Tutti',
    likes:1000000
  }

  const response_before = await api.get('/api/blogs')
  const length_before = response_before.body.length

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)  

  const response_after = await api.get('/api/blogs')
  const length_after = response_after.body.length

  expect(length_after).toBe(length_before)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await listHelper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      listHelper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})




afterAll(() => {
  mongoose.connection.close()
})