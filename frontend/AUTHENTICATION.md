# Frontend Authentication Integration

This document describes the JWT-based authentication system integrated with the backend.

## Features Implemented

### 1. **Authentication Context (`src/context/AuthContext.js`)**
- Centralized authentication state management
- Persists user data in localStorage
- Provides authentication methods across the app
- Handles user login, logout, and updates

### 2. **API Utilities (`src/utils/api.js`)**
- Centralized API communication with the backend
- Automatic cookie handling with `credentials: 'include'`
- Auth endpoints:
  - `login(email, password)` - User login
  - `register(name, email, password)` - User registration
  - `logout()` - User logout
  - `getProfile()` - Fetch user profile
  - `updateProfile(userData)` - Update user profile

### 3. **Protected Routes (`src/components/PrivateRoute.js`)**
- Wrapper component for protected pages
- Redirects unauthenticated users to login
- Shows loading spinner during auth check

### 4. **Updated Components**

#### Login Page (`src/pages/Login.js`)
- Toggle between login and registration
- Connects to backend authentication endpoints
- Shows error messages
- Loading states during authentication
- Auto-redirects after successful login

#### Navbar (`src/components/Navbar.js`)
- Shows user name when logged in
- Profile link for authenticated users
- Logout functionality with backend API call
- Responsive mobile menu

#### App Component (`src/App.js`)
- Wrapped with `AuthProvider`
- Protected routes for authenticated-only pages:
  - Assessment
  - Stress Management
  - Mood Tracker
  - Chatbot
  - Profile

#### Profile Page (`src/pages/Profile.js`)
- View and update user information
- Change password functionality
- Form validation
- Success/error messages

## Backend Integration

### JWT Cookie Authentication
The backend uses HTTP-only cookies for JWT tokens:
- Tokens are stored in secure, HTTP-only cookies
- Prevents XSS attacks
- 30-day token expiration
- CSRF protection with `sameSite: 'strict'`

### API Routes
- `POST /api/users/auth` - Login
- `POST /api/users` - Register
- `POST /api/users/logout` - Logout
- `GET /api/users/profile` - Get profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 2. Backend Configuration

Ensure your backend `.env` includes:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

### 3. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 4. Start the Application

Backend (runs on port 5000):
```bash
cd backend
npm start
```

Frontend (runs on port 3000):
```bash
cd frontend
npm start
```

## How Authentication Works

1. **User Registration/Login**
   - User submits credentials via the Login page
   - Frontend sends request to backend API
   - Backend validates and creates JWT token
   - JWT stored in HTTP-only cookie
   - User data returned and stored in AuthContext and localStorage

2. **Authenticated Requests**
   - Frontend makes API calls with `credentials: 'include'`
   - Browser automatically sends JWT cookie
   - Backend verifies token in `protect` middleware
   - Protected routes require valid JWT

3. **Logout**
   - Frontend calls logout API endpoint
   - Backend clears JWT cookie
   - Frontend clears user data from state and localStorage

4. **Session Persistence**
   - User data stored in localStorage
   - On app reload, AuthContext checks localStorage
   - User stays logged in across browser sessions
   - Token validation happens on protected API calls

## Security Features

- **HTTP-only Cookies**: Prevents JavaScript access to tokens
- **CSRF Protection**: `sameSite: 'strict'` cookie attribute
- **Secure Cookies**: Enabled in production mode
- **Password Hashing**: Backend uses bcrypt
- **Token Expiration**: 30-day expiration
- **Protected Routes**: Client-side route protection
- **Middleware Protection**: Server-side endpoint protection

## Using the Auth Context

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isLoggedIn, login, logout, updateUser } = useAuth();
  
  // Check if user is logged in
  if (isLoggedIn) {
    console.log('User:', user.name);
  }
  
  // Access user data
  return <div>Welcome, {user?.name}</div>;
}
```

## Creating Protected Routes

```javascript
import PrivateRoute from './components/PrivateRoute';

<Route
  path="/protected-page"
  element={
    <PrivateRoute>
      <YourProtectedComponent />
    </PrivateRoute>
  }
/>
```

## Making Authenticated API Calls

```javascript
import { authAPI } from '../utils/api';

// Get user profile
const profile = await authAPI.getProfile();

// Update profile
const updated = await authAPI.updateProfile({
  name: 'New Name',
  email: 'new@email.com',
});
```

## Testing the Authentication

1. Start both backend and frontend servers
2. Navigate to http://localhost:3000
3. Click "Login" in the navbar
4. Try registering a new account
5. Once logged in, you should see:
   - Your name in the navbar
   - Access to protected routes
   - Profile page functionality
6. Test logout functionality
7. Try accessing protected routes while logged out (should redirect to login)

## Troubleshooting

### Cookies Not Being Sent
- Ensure `credentials: 'include'` in fetch options
- Check CORS configuration allows credentials
- Verify backend and frontend URLs match environment variables

### CORS Errors
- Check backend CORS configuration
- Ensure `CLIENT_URL` in backend .env matches frontend URL
- Verify `credentials: true` in CORS options

### Token Validation Errors
- Check JWT_SECRET is set in backend .env
- Ensure cookie names match (backend sends 'jwt', frontend reads 'jwt')
- Verify token hasn't expired

### User Not Persisting After Reload
- Check browser localStorage for 'userInfo'
- Verify AuthContext useEffect is running
- Check browser console for errors
