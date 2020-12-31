const _ = require('lodash')

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

const favoriteBlog = array => {

  const reducer = (acc, current) => {
    return current.likes > acc.likes
      ? { title:current.title, author:current.author, likes:current.likes }
      : { title:acc.title, author:acc.author, likes:acc.likes }
    
  }

  return array.length === 0
    ? {}
    : array.reduce(reducer,{title:array[0].title, author:array[0].author, likes:array[0].likes})
}

const groupByAuthorCollection = blogs => {
  const collectionA = _.groupBy(blogs, function(o) {return o.author})
  const collectionB = _.map(collectionA, function(value, key){ return [ key, value.length, totalLikes(value) ]  } )
  return collectionB
}

const mostBlogs = blogs => {
  const collection = groupByAuthorCollection(blogs)
  const reducer = (accum, current) => {
    if(accum[1] < current[1]) {
      return current
    } else {
      return accum
    }
  }

  return collection.length === 0
    ? {}
    : {
      author:collection.reduce(reducer, collection[0])[0],
      blogs:collection.reduce(reducer, collection[0])[1]
    }

}

const mostLikes = blogs => {
  const collection = groupByAuthorCollection(blogs)
  const reducer = (accum, current) => {
    if(accum[2] < current[2]) {
      return current
    } else {
      return accum
    }
  }

  return collection.length === 0
    ? {}
    : {
      author:collection.reduce(reducer, collection[0])[0],
      likes:collection.reduce(reducer, collection[0])[2]
    }

}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
