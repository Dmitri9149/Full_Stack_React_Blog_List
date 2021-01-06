const { response } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of listHelper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('blog updating', () => {
    test('a blog with known id can be updated  ', async () => {
  
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 100
      }
  
      const blogsBefore = await listHelper.blogsInDb()
      const lengthBefore = await blogsBefore.length
      const blogToUpdate = await blogsBefore[0]
  
      console.log('blogs before !!!', blogToUpdate)
  
  
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const blogsAfter = await listHelper.blogsInDb()
      const lengthAfter = blogsAfter.length
      expect(lengthAfter).toBe(lengthBefore)
  
      expect(blogsAfter[0].likes).toBe(100)
    })
  
  })
  
  
  
afterAll(() => {
mongoose.connection.close()
})