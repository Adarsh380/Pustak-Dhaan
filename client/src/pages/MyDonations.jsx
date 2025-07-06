import { useState, useEffect } from 'react'

function MyDonations() {
  const [requests, setRequests] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [activeTab, setActiveTab] = useState('received') // 'received' or 'sent'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to view donations')
      setLoading(false)
      return
    }

    try {
      // Fetch requests received (as donor)
      const requestsResponse = await fetch('/api/donations/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Fetch requests sent (as recipient)
      const myRequestsResponse = await fetch('/api/donations/my-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (requestsResponse.ok && myRequestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        const myRequestsData = await myRequestsResponse.json()
        
        setRequests(requestsData)
        setMyRequests(myRequestsData)
      } else {
        setError('Failed to fetch donations')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateDonationStatus = async (donationId, status) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        alert(`Donation ${status} successfully!`)
        fetchDonations() // Refresh the list
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update donation status')
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
      <h1 className="text-3xl font-bold mb-6">My Donations</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-md font-semibold ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Requests Received ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-md font-semibold ${
            activeTab === 'sent'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Requests Sent ({myRequests.length})
        </button>
      </div>

      {/* Requests Received Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No donation requests received yet.</p>
            </div>
          ) : (
            requests.map(donation => (
              <div key={donation._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{donation.book.title}</h3>
                    <p className="text-gray-600 mb-2">by {donation.book.author}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Requested by: {donation.recipient.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Contact: {donation.recipient.email} | {donation.recipient.phone}
                    </p>
                    {donation.requestMessage && (
                      <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                        "{donation.requestMessage}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Requested on: {new Date(donation.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      donation.status === 'requested' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : donation.status === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : donation.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
                
                {donation.status === 'requested' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => updateDonationStatus(donation._id, 'approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateDonationStatus(donation._id, 'cancelled')}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                {donation.status === 'approved' && (
                  <div className="mt-4">
                    <button
                      onClick={() => updateDonationStatus(donation._id, 'completed')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests Sent Tab */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">You haven't requested any books yet.</p>
            </div>
          ) : (
            myRequests.map(donation => (
              <div key={donation._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{donation.book.title}</h3>
                    <p className="text-gray-600 mb-2">by {donation.book.author}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Donor: {donation.donor.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Contact: {donation.donor.email} | {donation.donor.phone}
                    </p>
                    {donation.requestMessage && (
                      <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                        Your message: "{donation.requestMessage}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Requested on: {new Date(donation.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      donation.status === 'requested' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : donation.status === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : donation.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default MyDonations
