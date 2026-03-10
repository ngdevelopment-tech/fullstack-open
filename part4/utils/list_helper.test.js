const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const blogs = [
    { _id: "1", title: "React patterns", author: "Michael Chan", likes: 7 },
    { _id: "2", title: "Go To Statement", author: "Edsger W. Dijkstra", likes: 5 },
    { _id: "3", title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12 }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(24)
  })

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
})

describe('favorite blog', () => {
  test('finds the blog with most likes', () => {
    const blogs = [
      { title: "React patterns", author: "Michael Chan", likes: 7 },
      { title: "Go To Statement", author: "Edsger W. Dijkstra", likes: 5 },
      { title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12 }
    ]

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})