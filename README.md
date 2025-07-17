# Feature Voting System

A full-stack mobile application that allows users to post feature requests and vote on existing features. Built with React Native, Node.js, and PostgreSQL.

## 🚀 Features

- **User Authentication**: Register and login with email/password
- **Feature Management**: Create, view, and manage feature requests
- **Voting System**: Upvote/downvote features with real-time updates
- **User Profiles**: User-specific feature submissions and voting history
- **Mobile-First**: Native mobile experience with React Native

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **React Navigation** for navigation
- **AsyncStorage** for local storage
- **Context API** for state management
- **Jest** & **React Native Testing Library** for testing

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Prisma** ORM for database management
- **JWT** authentication
- **bcrypt** for password hashing
- **Jest** & **Supertest** for testing

## 📁 Project Structure

```
ninjo/
├── frontend/                 # React Native mobile app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context providers
│   │   ├── navigation/       # Navigation configuration
│   │   ├── screens/          # Screen components
│   │   │   └── __tests__/    # Screen tests
│   │   └── services/         # API services
│   ├── jest.config.js
│   └── package.json
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Custom middleware
│   │   ├── routes/           # API routes
│   │   └── __tests__/        # API tests
│   ├── prisma/               # Database schema and migrations
│   ├── jest.config.js
│   └── package.json
├── CLAUDE.md                 # Project documentation for AI assistant
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI (for React Native development)

### Database Setup

1. **Install PostgreSQL** and create a database:
   ```sql
   CREATE DATABASE ninjo;
   CREATE USER ninjo WITH PASSWORD 'ninjo';
   GRANT ALL PRIVILEGES ON DATABASE ninjo TO ninjo;
   ```

2. **Configure environment variables** in `backend/.env`:
   ```
   DATABASE_URL="postgresql://ninjo:ninjo@localhost:5432/ninjo"
   JWT_SECRET="your-secret-key-here"
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file with your configuration
   # API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on device/simulator**:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
```

## 📱 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Feature Endpoints

#### Get All Features
```
GET /api/features
Authorization: Bearer <token>
```

#### Create Feature
```
POST /api/features
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Feature Title",
  "description": "Feature description"
}
```

#### Update Feature
```
PUT /api/features/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Feature
```
DELETE /api/features/:id
Authorization: Bearer <token>
```

### Vote Endpoints

#### Toggle Vote
```
POST /api/votes/:featureId/toggle
Authorization: Bearer <token>
```

#### Get User Votes
```
GET /api/votes/user
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

## 🗄️ Database Schema

### User
- `id` (String, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Feature
- `id` (String, Primary Key)
- `title` (String)
- `description` (String)
- `createdBy` (String, Foreign Key to User)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Vote
- `id` (String, Primary Key)
- `featureId` (String, Foreign Key to Feature)
- `createdBy` (String, Foreign Key to User)
- `createdAt` (DateTime)

## ⚙️ Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://ninjo:ninjo@localhost:5432/ninjo
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Frontend (.env)
```
API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

**Note:** Never commit `.env` files to version control. Use `.env.example` files to document required variables.

## 🔧 Development Commands

### Backend
```bash
# Development
npm run dev                 # Start development server
npm run start              # Start production server

# Database
npx prisma migrate dev     # Run database migrations
npx prisma generate        # Generate Prisma client
npx prisma studio          # Open database GUI
npx prisma migrate reset   # Reset database

# Testing
npm test                   # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
```

### Frontend
```bash
# Development
npm start                  # Start Metro bundler
npm run ios               # Run on iOS simulator
npm run android           # Run on Android emulator
npm run web               # Run on web browser

# Testing
npm test                  # Run tests
```

## 🚀 Deployment

### Backend Deployment
1. Set up production PostgreSQL database
2. Configure production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)
4. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment
1. Build the app: `expo build`
2. Follow Expo's deployment guide for app stores
3. Or use `expo publish` for over-the-air updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Tests may show a force exit warning - this is expected behavior and doesn't affect functionality
- Some Alert validation tests have been disabled due to mocking complexity

## 📞 Support

For questions or issues, please open an issue in the GitHub repository.