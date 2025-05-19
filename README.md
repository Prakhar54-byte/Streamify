# Streamify - Language Exchange Platform

Streamify is a feature-rich web application designed to connect language learners worldwide. Users can find language exchange partners, chat in real-time, and improve their language skills through video calls.

## Features

- **User Authentication**: Secure signup, login, and logout functionality.
- **User Profile**: Complete onboarding with personal details and language preferences.
- **Friend System**: Send, accept, and manage friend requests.
- **Real-time Chat**: Connect with language partners through text messaging.
- **Video Calls**: Practice speaking skills with integrated video call functionality.
- **Theme Customization**: Choose from 30+ themes to personalize your experience.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## Tech Stack

### Frontend
- **React 19**: Modern UI library for building the user interface.
- **React Router**: Client-side routing for SPA experience.
- **TanStack Query**: Data fetching, caching, and state management.
- **Stream Chat SDK**: Real-time chat functionality.
- **Stream Video SDK**: Video call integration.
- **Zustand**: Lightweight state management.
- **Tailwind CSS & DaisyUI**: Utility-first CSS and component library.
- **Vite**: Fast build tool and dev server.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express**: Web application framework.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: MongoDB object modeling.
- **JWT**: Secure authentication with JSON Web Tokens.
- **bcrypt**: Password hashing for security.
- **Stream API**: Backend integration for chat and video functionality.

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- MongoDB account
- Stream account for API keys

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   JWT_SECRET_KEY=your_jwt_secret
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Application Structure

### Backend Structure
```
backend/
  ├── src/
  │   ├── controllers/     # Route controllers
  │   ├── middleware/      # Express middlewares
  │   ├── models/          # Mongoose models
  │   ├── routes/          # Express routes
  │   ├── lib/             # Utilities and services
  │   └── server.js        # Entry point
  ├── .env                 # Environment variables
  └── package.json         # Dependencies
```

### Frontend Structure
```
frontend/
  ├── src/
  │   ├── components/      # Reusable UI components
  │   ├── constants/       # Application constants
  │   ├── hooks/           # Custom React hooks
  │   ├── lib/             # Utilities and API clients
  │   ├── pages/           # Page components
  │   ├── store/           # State management
  │   ├── App.jsx          # Root component
  │   └── main.jsx         # Entry point
  ├── public/              # Static assets
  ├── .env                 # Environment variables
  └── package.json         # Dependencies
```

## Key Features Implementation

### Authentication Flow
- User signup with validation
- Secure login with JWT
- Profile onboarding process

### Real-time Chat
- Peer-to-peer messaging
- Channel-based communication
- Message threading

### Video Calls
- WebRTC-based video calls
- Call controls (mute, video toggle)
- Speaker layout

## License
This project is licensed under the MIT License.

## Acknowledgments
- [Stream](https://getstream.io/) for the chat and video SDK
- [TanStack Query](https://tanstack.com/query/latest) for data fetching
- [DaisyUI](https://daisyui.com/) for UI components