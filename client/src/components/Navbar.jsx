import { Link } from 'react-router-dom'

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            📚 PustakDhaan
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/donation-drives" className="hover:text-blue-200">Donation Drives</Link>
            
            {user ? (
              <>
                <Link to="/donate-books" className="hover:text-blue-200">Donate Books</Link>
                <Link to="/my-donations" className="hover:text-blue-200">My Donations</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200">Admin</Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    {user.name}
                    {user.badge && user.badge !== 'none' && (
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        user.badge === 'gold' ? 'bg-yellow-500' :
                        user.badge === 'silver' ? 'bg-gray-300 text-gray-800' :
                        'bg-orange-600'
                      }`}>
                        {user.badge.toUpperCase()}
                      </span>
                    )}
                  </span>
                </div>
                <Link to="/profile" className="hover:text-blue-200">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
