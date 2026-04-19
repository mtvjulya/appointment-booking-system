# A Unified Web-Based Appointment Booking system for Government Services

React-based frontend for the Irish Government appointment booking system, styled according to gov.ie design guidelines.

## Running the Application

### Development Mode
npm run dev

### Production Build
npm run build

## Running Tests
npm test

### Core Application Files

`src/main.jsx` - Entry point, renders App component
`src/App.jsx` - Main router configuration
`src/index.css` - Global styles

### Authentication

`src/context/AuthContext.jsx`- Manages user authentication state using sessionStorage

### API Integration

`src/services/api.js` - Axios instance configured for backend communication

## Environment Variables

The frontend expects the backend API to be running at `https://16.170.252.193/api` in `src/services/api.js`.

## Technologies Used
- Node.js (v16 or higher)
- npm (v8 or higher)
- React 19
- React Router
- Axios
- Vite
- Vitest
- React Testing Library

## Design System

The application follows the Irish Government Design System (gov.ie) with:
- Official color palette (green: #1D70B8, gold: #FFDD00)
- Accessible typography
- WCAG 2.1 AA compliant contrast ratios
- Responsive design