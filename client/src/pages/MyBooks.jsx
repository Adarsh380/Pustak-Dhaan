import { useState, useEffect } from 'react'

function MyBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyBooks()
  }, [])

  const fetchMyBooks = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to view your books')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/books/my/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setBooks(data)
      } else {
        setError(data.message || 'Failed to fetch your books')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setBooks(books.filter(book => book._id !== bookId))
        alert('Book deleted successfully!')
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete book')
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
      <h1 className="text-3xl font-bold mb-6">My Books</h1>
      <p className="text-gray-600 mb-6">
        Manage the books you've added for donation. You can see their status and delete books that haven't been requested yet.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
              <span className={`text-xs px-2 py-1 rounded ${
                book.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : book.status === 'requested'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.status}
              </span>
            </div>
            
            {book.description && (
              <p className="text-gray-700 mb-4 text-sm">{book.description}</p>
            )}
            
            {book.publicationYear && (
              <p className="text-sm text-gray-600 mb-2">
                Published: {book.publicationYear}
              </p>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Language: {book.language}
            </p>
            
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">
                Added: {new Date(book.createdAt).toLocaleDateString()}
              </p>
              
              {book.status === 'available' && (
                <button
                  onClick={() => deleteBook(book._id)}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Delete Book
                </button>
              )}
              
              {book.status === 'requested' && (
                <p className="text-sm text-yellow-600 font-semibold">
                  Someone has requested this book!
                </p>
              )}
              
              {book.status === 'donated' && (
                <p className="text-sm text-green-600 font-semibold">
                  This book has been donated!
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't added any books yet.</p>
          <a 
            href="/add-book" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Your First Book
          </a>
        </div>
      )}
    </div>
  )
}

export default MyBooks
