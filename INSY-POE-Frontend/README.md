# INSY POE Frontend

A modern React frontend application for the INSY POE secure banking portal, built with Vite and featuring enterprise-grade security integration.

## Features

- **Authentication System**: Complete login and registration with JWT tokens
- **Role-Based Access Control**: Different interfaces for Customers and Employees
- **Secure API Integration**: Axios-based API service with automatic token handling
- **Responsive Design**: Mobile-first design with modern CSS
- **Protected Routes**: Secure navigation with authentication guards
- **Security Dashboard**: Real-time security status display

## Tech Stack

- **React 19**: Latest React with hooks and context
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **CSS3**: Modern styling with Flexbox and Grid

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd INSY-POE-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx          # Login form component
│   │   ├── Register.jsx       # Registration form component
│   │   └── Auth.css           # Authentication styles
│   ├── Dashboard.jsx          # Main dashboard component
│   ├── Dashboard.css          # Dashboard styles
│   ├── Landing.jsx            # Landing page component
│   ├── Landing.css            # Landing page styles
│   └── ProtectedRoute.jsx     # Route protection component
├── contexts/
│   └── AuthContext.jsx        # Authentication context provider
├── services/
│   └── api.js                 # API service configuration
├── App.jsx                    # Main app component with routing
├── App.css                    # Global styles
└── main.jsx                   # Application entry point
```

## API Integration

The frontend communicates with the backend API through the following endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/seed-employee` - Create test employee

### Test Endpoints
- `GET /api/security-test` - Security status information
- `GET /` - Health check

## User Roles

### Customer
- Access to customer dashboard
- View personal account information
- Basic portal features

### Employee
- Access to employee dashboard
- Advanced system features
- Administrative functions

## Security Features

- **JWT Token Management**: Automatic token storage and refresh
- **Protected Routes**: Authentication-based route protection
- **Role-Based Access**: Different interfaces based on user role
- **Secure API Calls**: Automatic authorization headers
- **Input Validation**: Client-side form validation
- **Error Handling**: Comprehensive error management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=INSY POE Frontend
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The `dist` folder contains the production-ready files

3. Deploy the `dist` folder to your web server

## Backend Integration

This frontend is designed to work with the INSY POE Backend. Ensure the backend is running and accessible at `http://localhost:5000`.

### CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite dev server).

### Security Headers

The backend implements comprehensive security headers including:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- HSTS
- And many more...

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test all authentication flows
5. Ensure responsive design works on all devices

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on port 5000
   - Check CORS configuration in backend

2. **Authentication Not Working**
   - Verify JWT_SECRET is set in backend
   - Check token expiration settings

3. **Styling Issues**
   - Clear browser cache
   - Check CSS file imports

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## License

This project is part of the INSY POE assignment.