const dummy = (blogs) => {
    return 1
}

const total_likes = array => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

module.exports = {
  dummy
}
