# Snake & Ladder

A modern, full-stack implementation of the classic Snake and Ladder game, built with **Next.js 16** and **React 19**. This project features a responsive UI, robust user authentication, and a comprehensive admin dashboard, leveraging the full power of Next.js for both frontend and backend operations.

## 🚀 Features

### Frontend (Client-Side)
- **Responsive UI**: Built with TailwindCSS, ensuring a seamless experience across desktop and mobile devices.
- **Interactive Gameplay**: Real-time game state updates and animations.
- **Dashboard**: User-friendly dashboard for managing profiles and viewing statistics.
- **Admin Panel**: Dedicated interface for administrators to manage users and game settings.
- **Localization**: Multi-language support using `i18next`.

### Backend (Server-Side)
- **API Routes**: RESTful API endpoints built with Next.js App Router handlers.
- **Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- **Database**: Integration with Supabase (PostgreSQL) for persistent data storage.
- **Middleware**: Protected routes and role-based access control.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useContext`)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: Node.js (via Next.js API Routes)
- **Database**: [Supabase](https://supabase.com/)
- **Auth**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **API Client**: [Axios](https://axios-http.com/)

## 📂 Project Structure

The project follows a modern Next.js App Router structure.

```
SnakeAndLadder/
├── client/                      # Root directory
│   ├── app/                     # App Router (Frontend & Backend)
│   │   ├── admin/               # Admin Dashboard Pages
│   │   ├── api/                 # Backend API Routes
│   │   │   ├── admin/           # Admin-specific API endpoints
│   │   │   ├── auth/            # Authentication (Login/Signup) endpoints
│   │   │   ├── game/            # Game logic endpoints
│   │   │   └── profile/         # User profile endpoints
│   │   ├── game/                # Game Interface Page
│   │   ├── profile/             # User Profile Page
│   │   ├── signup/              # Signup Page
│   │   ├── layout.js            # Root Layout
│   │   └── page.js              # Login/Landing Page
│   ├── components/              # Reusable React Components
│   │   ├── Game/                # Game-specific components (Board, Dice, etc.)
│   │   ├── UI/                  # Generic UI components
│   │   └── ...
│   ├── lib/                     # Utility functions and shared logic
│   ├── public/                  # Static assets (images, icons)
│   ├── src/                     # Source folder
│   │   └── services/            # Frontend API services (authService, etc.)
│   └── ...
└── ...
```

## 🔐 Architecture Overview

### Frontend
The frontend is built using **React Server Components** and **Client Components**.
- **Pages**: Located in `app/`, mapping directly to URL routes (e.g., `/game` -> `app/game/page.js`).
- **Components**: Modularized UI elements in `components/` for reusability.
- **Services**: `src/services/` contains helper classes to communicate with the backend API.

### Backend
The backend is implemented as **Next.js API Routes** located in `app/api/`.
- **Auth Flow**:
    1.  User submits credentials via `/app/page.js` (Login) or `/app/signup/page.js`.
    2.  Frontend calls `api/auth/login` or `api/auth/signup`.
    3.  Backend validates credentials using `bcrypt` and issues a `JWT`.
    4.  Token is stored (e.g., in cookies or local storage) for subsequent requests.
- **Game Logic**: handled via endpoints in `api/game`, interacting with the Supabase database to store match history and player stats.

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Supabase Account** (for database connection)

### Installation

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env.local` file in the `client` directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    JWT_SECRET=your_jwt_secret
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
