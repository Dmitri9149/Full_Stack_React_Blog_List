const User = require('../models/user')
const blogsRouter = require('express').Router()
const express = require('express')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1})

  response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  console.log('User', user)
  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
  if (blog.title === undefined || blog.url === undefined) {
    await response.status(400).end() 
  } else { 
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

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

blogsRouter.delete('/:id', async (request, response, next) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const userid = decodedToken.id

  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === userid.toString() ) {

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(400).json({ error: 'token does not correspond to the blog creator' })
  }
})


module.exports = blogsRouter