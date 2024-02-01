const { collection } = require('../models/blog')
const listHelper = require('../utils/list_helper')

const oneBlogList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }
]

const multipleBlogsList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog, returns its likes', () => {
    expect(listHelper.totalLikes(oneBlogList)).toBe(7)
  })

  test('when list has several blogs, returns the total', () => {
    expect(listHelper.totalLikes(multipleBlogsList)).toBe(36)
  })

  test('when list is empty, return 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
})

describe('most likes', () => {
  test('when list has one blog, it is the top liked', () => {
    expect(listHelper.mostLikes(oneBlogList)).toEqual(oneBlogList[0])
  })

  test('successfully gets most liked blog', () => {
    expect(listHelper.mostLikes(multipleBlogsList)).toEqual(multipleBlogsList[2])
  })

  test('when list is empty, return undefined', () => {
    expect(listHelper.mostLikes([])).toEqual(undefined)
  })
})

describe('author with most blogs', () => {
  test('test', () => {
    const result = listHelper.mostBlogs(multipleBlogsList)

    expect(result.author).toBe('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })
})
