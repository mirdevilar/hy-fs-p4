const _ = require('lodash')

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

const mostBlogs = (blogs) => {
  const authors = blogs.map((b) => b.author)
  const counts = _.countBy(authors)
  const maxKey = _.maxBy(_.keys(counts), (k) => counts[k])
  return { author: maxKey, blogs: counts[maxKey] }
}

module.exports = { dummy, totalLikes, mostLikes, mostBlogs }
