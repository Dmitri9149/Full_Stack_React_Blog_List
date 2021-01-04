const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
await Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes === undefined ? 0 : body.likes
  })

try {
  if (blog.title === undefined || blog.url === undefined) {
    await response.status(400).end() 
  } else { 
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())  
  }
} catch(exeption) {
  next(exeption)
}

})

module.exports = blogsRouter