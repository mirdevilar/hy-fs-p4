const _ = require('lodash')

const log = require('./logger')

const dummy = (blogs) => (1)

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, b) => sum + b.likes, 0)
  return likes
}

const favoriteBlog = (blogs) => {
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

const mostLikes = (blogs) => {
  const keys = _.map(_.keyBy(blogs, 'author'), 'likes')
  console.log(keys)
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
