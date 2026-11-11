# Bug Tracker – Client

React + Vite + Tailwind frontend for a Jira-style issue tracker: Kanban board, threaded comments, filters and real-time updates.

## Features
- JWT authentication (register / login)
- Projects with team members and roles (admin, manager, developer, viewer)
- Tickets with priority, type, assignee and screenshot attachments
- Drag-and-drop Kanban board (To Do, In Progress, Done)
- Threaded comments
- Filter by status, priority and assignee, keyword search and sort
- Edit and delete tickets with permission checks
- Live updates across users (Socket.io)
- Responsive layout

## Tech stack
React, Vite, Tailwind CSS, React Router, @hello-pangea/dnd, Socket.io client, react-hot-toast

## Setup
```
npm install
cp .env.example .env
npm run dev
```

## Environment variables
| Name | Description |
|---|---|
| VITE_SERVER_URL | Backend base URL, e.g. http://localhost:5000 |

## Build
```
npm run build
```

## Deployment
Deployed on Vercel. Set `VITE_SERVER_URL` to the deployed API URL. `vercel.json` handles SPA routing.

## Demo
Coming soon.