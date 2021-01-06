const blogsRouter = require('express').Router()
const express = require('express')
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
  if (blog.title === undefined || blog.url === undefined) {
    await response.status(400).end() 
  } else { 
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())  
  }
})


blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()

})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
      title:body.title,
      url:body.url,
      author:body.author,
      likes:body.likes
    }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})
module.exports = blogsRouter