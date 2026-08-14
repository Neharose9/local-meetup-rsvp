# LocalMeet RSVP

A full-stack web application for discovering local meetups, creating events, and managing RSVPs.

## Features

- User login with JWT authentication
- Secure password hashing using bcrypt
- View upcoming meetup events
- Create new events
- View event details
- Edit events created by the logged-in user
- Delete events created by the logged-in user
- RSVP to events with:
  - Going
  - Maybe
  - Declined
- Prevent duplicate RSVPs for the same user and event
- View the list of event attendees
- MySQL database
- Docker Compose setup for running the complete application

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- JWT (JSON Web Tokens)
- bcryptjs
- MySQL2

### Database

- MySQL 8.0

### DevOps

- Docker
- Docker Compose

## Project Structure

```text
local-meetup-rsvp/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── rsvps.js
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── app/
│   │   ├── events/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── init.sql
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Application Architecture

```text
                    ┌─────────────────┐
                    │    Next.js      │
                    │    Frontend     │
                    │   Port: 3000    │
                    └────────┬────────┘
                             │
                             │ HTTP / REST API
                             ▼
                    ┌─────────────────┐
                    │    Express.js   │
                    │     Backend     │
                    │   Port: 5000    │
                    └────────┬────────┘
                             │
                             │ MySQL
                             ▼
                    ┌─────────────────┐
                    │     MySQL       │
                    │   Port: 3306    │
                    └─────────────────┘
```

## Running the Application with Docker

### Prerequisites

- Docker Desktop
- Git

Docker Compose handles the frontend, backend, and database, so a separate local MySQL installation is not required.

### Clone the Repository

```bash
git clone https://github.com/NehaRose9/local-meetup-rsvp.git
cd local-meetup-rsvp
```

### Start the Application

Run:

```bash
docker compose up --build
```

Docker Compose starts:

- MySQL
- Express backend
- Next.js frontend

### Application URLs

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

MySQL:

```text
localhost:3306
```

### Stop the Application

```bash
docker compose down
```

## Database

The MySQL database is initialized using:

```text
database/init.sql
```

The database contains the following tables:

### Users

Stores user account information.

### Events

Stores meetup event information including:

- Title
- Description
- Location
- Event date
- Event creator

### RSVPs

Stores RSVP information for users and events.

The database also contains a unique constraint on:

```text
(user_id, event_id)
```

to prevent duplicate RSVPs for the same user and event.

## Authentication

The application uses JWT-based authentication.

After successful login:

1. The backend validates the user's credentials.
2. A JWT token is generated.
3. The frontend stores the token.
4. Protected API requests send the token using the Bearer Token format.

Example:

```text
Authorization: Bearer <JWT_TOKEN>
```

Passwords are stored using bcrypt hashing rather than plain text.

## API Endpoints

### Authentication

#### Login

```http
POST /api/auth/login
```

### Events

#### Get all events

```http
GET /api/events
```

#### Create an event

```http
POST /api/events
```

Requires authentication.

#### Get event details

```http
GET /api/events/:id
```

#### Update an event

```http
PUT /api/events/:id
```

Requires authentication and event ownership.

#### Delete an event

```http
DELETE /api/events/:id
```

Requires authentication and event ownership.

### RSVPs

#### Create or update RSVP

```http
POST /api/rsvps/:eventId
```

Requires authentication.

Supported RSVP statuses:

```text
going
maybe
declined
```

## Main User Flow

```text
Login
  ↓
Events List
  ↓
Create Event
  ↓
Event Details
  ↓
RSVP
  ↓
View Attendees
```

Event owners can also:

```text
Event Details
     ↓
 Edit Event
     ↓
 Save Changes
```

or:

```text
Event Details
     ↓
 Delete Event
```

## Demo Account

The database is initialized with demo users.

Example:

```text
Email: neha@example.com
```

Use the seeded password configured for the demo account.

## Docker Services

The application runs three services through Docker Compose:

```text
meetup-frontend
      │
      ▼
meetup-backend
      │
      ▼
meetup-mysql
```

### Frontend

```text
Port: 3000
```

### Backend

```text
Port: 5000
```

### MySQL

```text
Port: 3306
```

## Security

- JWT authentication is used for protected API operations.
- Passwords are hashed using bcrypt.
- Event modification requires authentication.
- Users can only edit or delete their own events.
- Duplicate RSVPs are prevented at the database level.
- Environment files containing secrets are excluded using `.gitignore`.

## Environment Variables

The backend uses environment variables for database configuration and JWT authentication.

Example:

```text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=meetup_db
DB_PORT=3306
JWT_SECRET=your_secret
```

For Docker, the backend connects to MySQL using the Docker Compose service name.

> Do not commit `.env` files or real secrets to GitHub.

## GitHub Repository

[LocalMeet RSVP](https://github.com/NehaRose9/local-meetup-rsvp)

## Author

**Neha Rose Shaju**
