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
  const pairsPerBlog = blogs.map((b) => [b.author, b.likes])

  const pairsPerAuthor = _(pairsPerBlog)
    .groupBy((item) => item[0])
    .mapValues((group, key) => _.reduce(group, (sum, item) => sum + item[1], 0))
    .value()
  const maxKey = _(pairsPerAuthor)
    .keys()
    .maxBy((k) => pairsPerAuthor[k])

  return { author: maxKey, likes: pairsPerAuthor[maxKey] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
