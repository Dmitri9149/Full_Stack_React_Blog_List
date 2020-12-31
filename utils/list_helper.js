const dummy = (blogs) => {
    return 1
}

const totalLikes = array => {

  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

const favoriteBlogs = array => {
  const reducer = (acc, current) => {
    return current.likes > acc.likes
      ? { title:current.title, author:current.author, likes:current.likes }
      : { titile:acc.title, author:acc.author, likes:acc.likes }
    
  }

  return array.length === 0
    ? {}
    : array.reduce(reducer)
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
