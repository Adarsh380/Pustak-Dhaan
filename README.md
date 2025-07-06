<<<<<<< HEAD
# pustak-dhann
=======
# PustakDhaan - Book Donation Drive Application 📚

PustakDhaan is a full-stack web application that connects book lovers to share and donate books within their communities. The name "PustakDhaan" comes from Hindi, where "Pustak" means book and "Dhaan" means donation.

## Features

### 🎯 Core Features
- **User Authentication**: Secure registration and login system
- **Book Management**: Add, edit, and delete books for donation
- **Donation Requests**: Request books and manage donation status
- **Search & Filter**: Find books by title, author, genre, and condition
- **User Profiles**: Manage personal information and donation history

### 👥 User Roles
- **Donors**: Add books for donation and manage requests
- **Recipients**: Browse and request books
- **Admins**: Manage users and oversee the platform

### 🔍 Book Categories
- Fiction & Non-Fiction
- Science & Technology
- History & Biography
- Children's Books
- Academic Materials
- And more...

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pustakdhaan
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pustakdhaan
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

5. **Start the Application**
   
   **Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
pustakdhaan/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Donation.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── books.js
│   │   └── donations.js
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all available books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book (authenticated)
- `PUT /api/books/:id` - Update book (authenticated)
- `DELETE /api/books/:id` - Delete book (authenticated)
- `GET /api/books/my/books` - Get user's books (authenticated)

### Donations
- `POST /api/donations/request` - Request book donation (authenticated)
- `GET /api/donations/requests` - Get donation requests (authenticated)
- `GET /api/donations/my-requests` - Get user's requests (authenticated)
- `PUT /api/donations/:id/status` - Update donation status (authenticated)
- `GET /api/donations/:id` - Get single donation (authenticated)

## Usage

### For Donors
1. Register an account and login
2. Add books you want to donate
3. Manage incoming requests from recipients
4. Approve/reject requests and coordinate book transfers

### For Recipients
1. Register an account and login
2. Browse available books
3. Request books you're interested in
4. Track your request status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

This project is licensed under the ISC License.

## Support

For support, email support@pustakdhaan.com or join our community forum.

## Acknowledgments

- Thanks to all contributors who help make book sharing accessible
- Inspired by the community spirit of sharing knowledge
- Built with love for book enthusiasts

---

**Happy Reading! 📖✨**
>>>>>>> c9b580c (Commited PustakDhann - enabling donation of books website)
