const log = require('./logger')

const dummy = (blogs) => (1)

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, b) => sum + b.likes, 0)
  log.info(likes)
  return likes
}

module.exports = { dummy, totalLikes }
