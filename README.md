# 🐞 Bug Tracker – Client

A Jira-style issue tracker where teams manage projects, report bugs as tickets, assign them to teammates and move them across a Kanban board.

This repository is the **React frontend**. The backend is here: [bug-tracker-server](https://github.com/sruthi28021998/bug-tracker-server.git).

## 🔗 Links

| | |
|---|---|
| 🌐 Live app | https://bug-tracker-client-dusky.vercel.app |
| ⚙️ API | https://bug-tracker-server-yehl.onrender.com |
| 🎥 Demo video | <your-video-link> |
| 💻 Backend repo | https://github.com/sruthi28021998/bug-tracker-server.git |

> The API runs on a free Render plan and sleeps when idle, so the first request can take 30 to 60 seconds.

## 🔑 Test accounts

| Role | Email | Password |
|---|---|---|
| Owner (admin) | rahul@bugtracker.com | Rahul@2026 |
| Developer | priya@bugtracker.com | Priya@2026 |
| Viewer | amit@bugtracker.com | Amit@2026 |

## 📸 Screenshots

- [Login](screenshots/login.png)
- [Projects](screenshots/projects.png)
- [Kanban board](screenshots/board.png)
- [Ticket details](screenshots/ticket-details.png)
- [Comments](screenshots/comments.png)
- [Filters](screenshots/filters.png)
- [Viewer role](screenshots/viewer-role.png)
- [Mobile view](screenshots/mobile.png)


## ✨ Features

- Register and log in with JWT authentication
- Create projects and invite teammates by email
- Role-based access: admin, manager, developer, viewer
- Report bugs and feature requests with priority, assignee and image attachments
- Drag-and-drop Kanban board (To Do, In Progress, Done)
- Threaded comments on every ticket
- Filter by status, priority and assignee, keyword search and sorting
- Edit and delete tickets with a confirmation popup and permission checks
- Real-time updates across users (Socket.io)
- Loading spinners, toast notifications and a responsive layout

## 👥 Roles

| Role | Permissions |
|---|---|
| Admin (project owner) | Everything, including deleting the project |
| Manager | Manage members, edit the project, create, edit and delete any ticket |
| Developer | Create and edit tickets, delete own tickets, comment |
| Viewer | Read only |

## 🧰 Tech stack

React, Vite, Tailwind CSS, React Router, @hello-pangea/dnd, Socket.io client, react-hot-toast

## 📁 Folder structure

```
client/
├── screenshots/
├── src/
│   ├── components/   Layout, TicketModal, Comments, Filters, Members, ConfirmDialog, Spinner
│   ├── context/      AuthContext
│   ├── pages/        Auth, Projects, Board
│   ├── utils/        permissions
│   ├── api.js
│   ├── socket.js
│   └── App.jsx
├── vercel.json
└── .env
```

## 🚀 Getting started

Requirements: Node.js 18 or newer, and the [backend](https://github.com/<username>/bug-tracker-server) running.

```bash
git clone https://github.com/<username>/bug-tracker-client.git
cd bug-tracker-client
npm install
cp .env
npm run dev
```

The app runs at http://localhost:5173

## 🔐 Environment variables

| Name | Description |
|---|---|
| `VITE_SERVER_URL` | Backend base URL, for example `http://localhost:5000` (no `/api`, no trailing slash) |

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |

## ☁️ Deployment

Deployed on **Vercel**. Set `VITE_SERVER_URL` to the deployed API URL. `vercel.json` rewrites every route to `index.html` so page refreshes work.

