const log = require('./logger')

const dummy = (blogs) => (1)

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, b) => sum + b.likes, 0)
  return likes
}

const mostLikes = (blogs) => {
  const mostLikesIndex = blogs.reduce((maxLikesIndex, blog, i) => {
    return blog.likes > blogs[maxLikesIndex].likes ? i : maxLikesIndex
  }, 0)
  //log.info(blogs[mostLikesIndex])
  return blogs[mostLikesIndex]
}

module.exports = { dummy, totalLikes, mostLikes }
