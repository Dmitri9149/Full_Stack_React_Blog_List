const blogsRouter = require('express').Router()
const e = require('express')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    await Blog
        .find({})
        .then(blogs => {
          response.json(blogs.map(blog => blog.toJSON()))
        })
  } catch(exception) {
    next(exception)
  }
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


blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const blog = {
      title:body.title,
      url:body.url,
      author:body.author,
      likes:body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})


module.exports = blogsRouter