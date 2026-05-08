# Water Quality Login Package

This project includes a complete registration and login flow using an Express backend and a static frontend.

## Setup

1. Open a terminal in `backend`.
2. Run `npm install`.
3. Start the server with `npm start`.
4. Open `http://localhost:3000` in your browser.

## Features

- Register with full name, email, and password.
- Login with email and password.
- Passwords are hashed with bcrypt.
- Simple JSON-based persistence in `backend/users.json`.
- Clean responsive frontend UI in `frontend/index.html`.

## Files

- `backend/package.json` - project metadata and dependencies.
- `backend/server.js` - Express API server and static file hosting.
- `backend/users.json` - demo persistence file for registered users.
- `frontend/index.html` - auth UI markup.
- `frontend/style.css` - auth UI styling.
- `frontend/script.js` - frontend form handling and API integration.
