import { useState, useEffect } from 'react'

function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    condition: ''
  })

  useEffect(() => {
    fetchBooks()
  }, [filters])

  const fetchBooks = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.genre) queryParams.append('genre', filters.genre)
      if (filters.condition) queryParams.append('condition', filters.condition)

      const response = await fetch(`/api/books?${queryParams}`)
      const data = await response.json()

      if (response.ok) {
        setBooks(data.books)
      } else {
        setError(data.message || 'Failed to fetch books')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const requestBook = async (bookId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to request books')
      return
    }

    try {
      const response = await fetch('/api/donations/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          requestMessage: 'I would like to request this book.',
          pickupMethod: 'pickup'
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Book request sent successfully!')
        fetchBooks() // Refresh the list
      } else {
        alert(data.message || 'Failed to request book')
      }
    } catch (err) {
      alert('Network error. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>
      <p className="text-gray-600 mb-6">
        Browse books donated by community members. Click "Request This Book" to request a book from its donor.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or author..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Genre
            </label>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Children">Children</option>
              <option value="Academic">Academic</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Condition
            </label>
            <select
              name="condition"
              value={filters.condition}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Conditions</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">by {book.author}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {book.genre}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {book.condition}
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                {book.language}
              </span>
            </div>
            
            {book.description && (
              <p className="text-gray-700 mb-4 text-sm">{book.description}</p>
            )}
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">
                Donated by: {book.donor.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Contact: {book.donor.phone}
              </p>
              
              {book.status === 'available' ? (
                <button
                  onClick={() => requestBook(book._id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Request This Book
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
                >
                  Not Available
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Books
