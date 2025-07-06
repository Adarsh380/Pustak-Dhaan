import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="text-center">
      <div className="hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white p-16 rounded-lg mb-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to PustakDhaan</h1>
        <p className="text-xl mb-8">
          Connect book lovers - Share knowledge, spread joy through book donations
        </p>
        <div className="space-x-4">
          <Link 
            to="/books" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Browse Available Books
          </Link>
          <Link 
            to="/add-book" 
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 inline-block"
          >
            Add Book to Donate
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">Add Books to Donate</h3>
          <p className="text-gray-600">
            Share your books with others who need them. Give your books a second life!
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Find & Request Books</h3>
          <p className="text-gray-600">
            Browse through books donated by generous community members and request the ones you need.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600">
            Connect with fellow book lovers and build a community of readers.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h4 className="font-semibold mb-2">Register</h4>
            <p className="text-sm text-gray-600">Create your account</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold mb-2">Add Your Books</h4>
            <p className="text-sm text-gray-600">Add books you want to donate</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h4 className="font-semibold mb-2">Get Requests</h4>
            <p className="text-sm text-gray-600">Receive requests from readers</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">4</span>
            </div>
            <h4 className="font-semibold mb-2">Complete Donation</h4>
            <p className="text-sm text-gray-600">Approve and share your books</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
