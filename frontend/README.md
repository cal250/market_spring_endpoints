# Customer Management Frontend

This is a modern React frontend for the Customer Management System, built with Vite, TypeScript, and Tailwind CSS.

## Features

- Modern, responsive UI with Tailwind CSS
- Type-safe development with TypeScript
- Efficient data fetching with React Query
- Form handling with React Hook Form
- Toast notifications for user feedback
- CRUD operations for customer management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

- The application uses Vite for fast development and building
- TypeScript for type safety
- Tailwind CSS for styling
- React Query for data fetching and caching
- React Hook Form for form handling
- React Hot Toast for notifications

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── CustomerForm.tsx
  │   └── CustomerList.tsx
  ├── services/         # API services
  │   └── api.ts
  ├── App.tsx          # Main application component
  ├── main.tsx         # Application entry point
  └── index.css        # Global styles
```

## Backend Integration

The frontend expects the backend to be running at `http://localhost:8080/api`. Make sure the backend server is running before starting the frontend application.
