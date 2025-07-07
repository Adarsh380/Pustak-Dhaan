import React, { useState, useEffect } from 'react'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('drives')
  const [drives, setDrives] = useState([])
  const [donations, setDonations] = useState([])
  const [schools, setSchools] = useState([])
  const [allocations, setAllocations] = useState([])
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [driveForm, setDriveForm] = useState({
    name: '',
    description: '',
    location: '',
    gatedCommunity: '',
    coordinatorId: '',
    startDate: '',
    endDate: ''
  })

  const [schoolForm, setSchoolForm] = useState({
    name: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    contactPerson: { name: '', phone: '', email: '' },
    studentsCount: 0
  })

  const [allocationForm, setAllocationForm] = useState({
    donationDriveId: '',
    schoolId: '',
    booksAllocated: { '2-4': 0, '4-6': 0, '6-8': 0, '8-10': 0 },
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [drivesRes, donationsRes, schoolsRes, allocationsRes, usersRes] = await Promise.all([
        fetch('/api/drives/all', { headers }),
        fetch('/api/donations/all', { headers }),
        fetch('/api/schools/all', { headers }),
        fetch('/api/allocations/all', { headers }),
        fetch('/api/auth/users', { headers })
      ])

      const [drivesData, donationsData, schoolsData, allocationsData, usersData] = await Promise.all([
        drivesRes.json(),
        donationsRes.json(),
        schoolsRes.json(),
        allocationsRes.json(),
        usersRes.json()
      ])

      setDrives(drivesData)
      setDonations(donationsData)
      setSchools(schoolsData)
      setAllocations(allocationsData)
      setCoordinators(usersData.filter(user => user.role === 'coordinator'))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDrive = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/drives/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(driveForm)
      })

      if (response.ok) {
        alert('Donation drive created successfully!')
        setDriveForm({
          name: '',
          description: '',
          location: '',
          gatedCommunity: '',
          coordinatorId: '',
          startDate: '',
          endDate: ''
        })
        fetchData()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create drive')
      }
    } catch (error) {
      console.error('Error creating drive:', error)
      alert('Failed to create drive')
    }
  }

  const handleCreateSchool = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/schools/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(schoolForm)
      })

      if (response.ok) {
        alert('School created successfully!')
        setSchoolForm({
          name: '',
          address: { street: '', city: '', state: '', zipCode: '' },
          contactPerson: { name: '', phone: '', email: '' },
          studentsCount: 0
        })
        fetchData()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create school')
      }
    } catch (error) {
      console.error('Error creating school:', error)
      alert('Failed to create school')
    }
  }

  const handleAllocateBooks = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/allocations/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(allocationForm)
      })

      if (response.ok) {
        alert('Books allocated successfully!')
        setAllocationForm({
          donationDriveId: '',
          schoolId: '',
          booksAllocated: { '2-4': 0, '4-6': 0, '6-8': 0, '8-10': 0 },
          notes: ''
        })
        fetchData()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to allocate books')
      }
    } catch (error) {
      console.error('Error allocating books:', error)
      alert('Failed to allocate books')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage donation drives, schools, and book allocations.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'drives', label: 'Donation Drives' },
            { id: 'schools', label: 'Schools' },
            { id: 'allocations', label: 'Book Allocations' },
            { id: 'donations', label: 'Donations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'drives' && (
        <div className="space-y-8">
          {/* Create Drive Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Donation Drive</h2>
            <form onSubmit={handleCreateDrive} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Drive Name"
                value={driveForm.name}
                onChange={(e) => setDriveForm({...driveForm, name: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={driveForm.location}
                onChange={(e) => setDriveForm({...driveForm, location: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Gated Community"
                value={driveForm.gatedCommunity}
                onChange={(e) => setDriveForm({...driveForm, gatedCommunity: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <select
                value={driveForm.coordinatorId}
                onChange={(e) => setDriveForm({...driveForm, coordinatorId: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Coordinator</option>
                {coordinators.map(coord => (
                  <option key={coord._id} value={coord._id}>{coord.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={driveForm.startDate}
                onChange={(e) => setDriveForm({...driveForm, startDate: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="date"
                value={driveForm.endDate}
                onChange={(e) => setDriveForm({...driveForm, endDate: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={driveForm.description}
                onChange={(e) => setDriveForm({...driveForm, description: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                rows="2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 md:col-span-2"
              >
                Create Drive
              </button>
            </form>
          </div>

          {/* Drives List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Donation Drives</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coordinator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Books Received
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drives.map(drive => (
                    <tr key={drive._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {drive.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {drive.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {drive.coordinator.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          drive.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {drive.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {drive.totalBooksReceived}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content would go here... */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drive
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Books
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map(donation => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donation.donor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.donationDrive.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.totalBooks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'collected' ? 'bg-green-100 text-green-800' : 
                        donation.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'schools' && (
        <div className="space-y-8">
          {/* Create School Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New School</h2>
            <form onSubmit={handleCreateSchool} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="School Name"
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({...schoolForm, name: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Street Address"
                value={schoolForm.address.street}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  address: {...schoolForm.address, street: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={schoolForm.address.city}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  address: {...schoolForm.address, city: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={schoolForm.address.state}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  address: {...schoolForm.address, state: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={schoolForm.address.zipCode}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  address: {...schoolForm.address, zipCode: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Number of Students"
                value={schoolForm.studentsCount}
                onChange={(e) => setSchoolForm({...schoolForm, studentsCount: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Contact Person Name"
                value={schoolForm.contactPerson.name}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  contactPerson: {...schoolForm.contactPerson, name: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="tel"
                placeholder="Contact Phone"
                value={schoolForm.contactPerson.phone}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  contactPerson: {...schoolForm.contactPerson, phone: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={schoolForm.contactPerson.email}
                onChange={(e) => setSchoolForm({
                  ...schoolForm, 
                  contactPerson: {...schoolForm.contactPerson, email: e.target.value}
                })}
                className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 md:col-span-2"
              >
                Add School
              </button>
            </form>
          </div>

          {/* Schools List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Government Schools</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Books Received
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schools.map(school => (
                    <tr key={school._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {school.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {school.address.city}, {school.address.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {school.contactPerson.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {school.studentsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {school.totalBooksReceived}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="space-y-8">
          {/* Allocate Books Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Allocate Books to School</h2>
            <form onSubmit={handleAllocateBooks} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={allocationForm.donationDriveId}
                  onChange={(e) => setAllocationForm({...allocationForm, donationDriveId: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Donation Drive</option>
                  {drives.map(drive => (
                    <option key={drive._id} value={drive._id}>
                      {drive.name} - Available: {drive.totalBooksReceived} books
                    </option>
                  ))}
                </select>
                
                <select
                  value={allocationForm.schoolId}
                  onChange={(e) => setAllocationForm({...allocationForm, schoolId: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select School</option>
                  {schools.map(school => (
                    <option key={school._id} value={school._id}>
                      {school.name} - {school.address.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Books to Allocate by Age Category</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {Object.entries(allocationForm.booksAllocated).map(([category, count]) => (
                    <div key={category}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age {category} years
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => setAllocationForm({
                          ...allocationForm,
                          booksAllocated: {
                            ...allocationForm.booksAllocated,
                            [category]: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={allocationForm.notes}
                  onChange={(e) => setAllocationForm({...allocationForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-lg font-medium text-gray-800">
                  Total Books to Allocate: {Object.values(allocationForm.booksAllocated).reduce((sum, count) => sum + count, 0)}
                </div>
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
              >
                Allocate Books
              </button>
            </form>
          </div>

          {/* Allocations List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Book Allocations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Drive
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Books Allocated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocations.map(allocation => (
                    <tr key={allocation._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {allocation.donationDrive.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {allocation.school.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-xs">
                          <div>2-4: {allocation.booksAllocated['2-4']}</div>
                          <div>4-6: {allocation.booksAllocated['4-6']}</div>
                          <div>6-8: {allocation.booksAllocated['6-8']}</div>
                          <div>8-10: {allocation.booksAllocated['8-10']}</div>
                          <div className="font-semibold">Total: {allocation.totalBooksAllocated}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(allocation.allocationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          allocation.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          allocation.status === 'allocated' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {allocation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
