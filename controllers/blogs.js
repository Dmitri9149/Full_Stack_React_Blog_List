const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
await Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result.toJSON())
    })
})

module.exports = blogsRouter