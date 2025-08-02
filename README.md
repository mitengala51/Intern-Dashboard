# 🚀 Full Stack Intern Dashboard

A modern, professional full-stack web application built with **React.js**, **Node.js**, **Express**, and **MongoDB**. Features advanced JWT authentication, real-time data updates, and a beautiful responsive UI.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 🔐 Authentication & Security
- **JWT Authentication** with refresh tokens
- **Password hashing** with bcrypt (12 salt rounds)
- **Rate limiting** and security headers with Helmet
- **Input validation** with express-validator
- **Automatic token refresh** on expiration

### 📊 Dashboard Features
- **Real-time user statistics** and progress tracking
- **Dynamic reward system** with automatic unlocking
- **Donation simulation** for testing
- **Level progression** (Starter → Bronze → Silver → Gold → Platinum)
- **Referral code generation** with copy-to-clipboard
- **Interactive progress bars** and animations

### 🏆 Leaderboard System
- **Global leaderboard** with rankings
- **User position tracking**
- **Responsive table design**
- **Real-time updates**

### 🎨 Modern UI/UX
- **Glassmorphism design** with backdrop blur effects
- **Gradient backgrounds** and smooth animations
- **Responsive design** for all screen sizes
- **Loading states** and error handling
- **Professional typography** and iconography

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks and Context API
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for beautiful icons
- **ES6+ JavaScript** with modern patterns

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limit** for API protection
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 🚀 Live Demo

- **Frontend**: [https://intern-dashboard-nine.vercel.app](https://intern-dashboard-nine.vercel.app)
- **Backend API**: [https://intern-dashboard-production-5588.up.railway.app](https://intern-dashboard-production-5588.up.railway.app)

## 📥 Local Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/mitengala51/Intern-Dashboard.git
cd Intern-Dashboard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env
```

**Add the following to your `.env` file:**
```env
# Database (Production MongoDB - Ready to use)
MONGODB_URI="mongodb+srv://mitengala51:BpYN8lmSlOY9pwnp@cluster0.fjxsuqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# JWT Secrets (Production keys - Ready to use)
JWT_SECRET=J7&W^$gdz%I*I@d6fYrGnLWIk2C7JT1pCA9
JWT_REFRESH_SECRET=1cWwEQLZj&Hq0Ry2OV8dhjnYIb&CskyQC8q

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Start the backend server:**
```bash
# Development mode with auto-restart
node server.js

# Or production mode
npm start
```

The backend will be running at `http://localhost:5000`

✅ **Database is already configured and ready to use - no additional setup required!**

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

**⚠️ Important: Update API Base URL for Local Development**

Open `src/services/apiService.js` and change the baseURL:

```javascript
// Change this line (production URL):
this.baseURL = 'https://intern-dashboard-production-5588.up.railway.app/api';

// To this (local development URL):
this.baseURL = 'http://localhost:5000/api';
```

**Start the frontend development server:**
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

🎉 **That's it! No database setup required - everything is ready to use!**

## 📱 Usage

### Registration & Login
1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with your credentials
3. **Auto-generated referral code** for sharing

### Dashboard Features
- **View Statistics**: Total donations, level, rewards unlocked
- **Simulate Donations**: Test the reward system
- **Track Progress**: See progress toward next reward
- **Copy Referral Code**: Share with others

### Leaderboard
- **View Rankings**: See top performers
- **Your Position**: Find your rank among all users
- **Compare Stats**: See donations and levels

## 🔧 Development

### Project Structure

```
intern-dashboard/
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── leaderboard/  # Leaderboard components
│   │   │   ├── layout/       # Layout components
│   │   │   └── common/       # Shared components
│   │   ├── context/          # React context
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   └── package.json
├── backend/                   # Node.js backend
│   ├── server.js             # Main server file
│   ├── .env                  # Environment variables
│   └── package.json
└── README.md
```

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm start            # Start production server
npm run dev          # Start with nodemon (auto-restart)
npm test             # Run tests
npm run lint         # Run ESLint
```

## 🔒 Security Features

- **Password Requirements**: Minimum 6 characters with uppercase, lowercase, and numbers
- **JWT Tokens**: 15-minute access tokens with 7-day refresh tokens
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers for production

## 🌐 Deployment

### Frontend (Netlify/Vercel)
1. Push your code to GitHub
2. Connect your repository to Netlify or Vercel
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Backend (Railway/Render/Heroku)
1. Push your code to GitHub
2. Connect to your hosting platform
3. Set environment variables (same as provided above)
4. Deploy with `npm start`

**Production Environment Variables:**
```env
MONGODB_URI="mongodb+srv://mitengala51:BpYN8lmSlOY9pwnp@cluster0.fjxsuqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=J7&W^$gdz%I*I@d6fYrGnLWIk2C7JT1pCA9
JWT_REFRESH_SECRET=1cWwEQLZj&Hq0Ry2OV8dhjnYIb&CskyQC8q
CLIENT_URL=https://intern-dashboard-nine.vercel.app
NODE_ENV=production
PORT=5000
```

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that CORS is properly configured in `server.js`

#### MongoDB Connection
- The MongoDB database is already configured and hosted on MongoDB Atlas
- No additional database setup is required
- Connection string is provided in the environment variables

#### JWT Token Issues
- Ensure JWT secrets are set in environment variables
- Check token expiration settings

#### Frontend API Calls
- Verify the `baseURL` in `apiService.js` points to correct backend URL
- Check network tab in browser dev tools for API responses

### Getting Help
1. Check the browser console for error messages
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Miten Gala**
- GitHub: [@mitengala51](https://github.com/mitengala51)
- Project: [Intern Dashboard](https://github.com/mitengala51/Intern-Dashboard)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons

---

⭐ **If you found this project helpful, please give it a star!** ⭐

**Happy Coding! 🚀**
