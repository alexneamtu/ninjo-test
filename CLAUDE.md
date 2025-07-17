You’ll be given the following mini-project:
Feature Voting System – Let users post a feature and upvote others
The project must have:
●
A database
●
●
A backend API
A frontend UI: CHOOSE ONE native mobile: iOS or Android# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Feature Voting System - A mini-project that allows users to post features and upvote others. The system consists of:
- Database for storing features and votes
- Backend API for handling requests
- Native mobile frontend (iOS or Android)

## Architecture

The system will follow a standard client-server architecture:
- **Frontend**: Native mobile app (iOS or Android)
- **Backend**: RESTful API server
- **Database**: For persistence of features, votes, and user data

## Tech Stack

### Database
- **PostgreSQL**: Full-featured relational database
- **Prisma**: ORM for database management and type-safe queries

### Backend API
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework (assumed)
- **Prisma**: Database ORM and schema management

### Frontend
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native (recommended)

## Development Setup

### Backend
```bash
# Install dependencies
npm install

# Database setup
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### Frontend (React Native)
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```