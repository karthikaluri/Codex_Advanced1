# Codex_Advanced - MERN Coding Platform (Demo)

This repository is a demo advanced version of **Codex**. It includes:
- Backend: Express + Mongoose + JWT auth + Docker-based runner for sandboxed execution.
- Frontend: Vite + React + Monaco editor (syntax highlighting), login/register, problem list & problem view.
- Seed script to add example problems.

IMPORTANT: This is a demo. DO NOT run untrusted code on public servers without robust sandboxing, resource limits, and security reviews.

## Requirements (local dev)
- Node.js (16+)
- npm or yarn
- MongoDB running locally (or provide a cloud Mongo URI)
- Docker Desktop (running) for executing code safely in containers
- VS Code (optional, recommended)

## Setup (VS Code friendly)

1. Open the project folder in VS Code.
2. Backend setup:
   - Open a terminal in `/backend`.
   - Copy `.env.example` to `.env` and edit values (JWT_SECRET, MONGO_URI).
   - Install deps: `npm install`
   - Seed sample problems (optional): `node seed.js`
   - Start backend: `npm run dev` (or `npm start`)

3. Frontend setup:
   - Open a terminal in `/frontend`.
   - Install deps: `npm install`
   - Start frontend: `npm run dev`
   - Open `http://localhost:3000` in your browser.

## How the judge works (demo)
- The backend `utils/dockerRunner.js` writes temporary files to `/tmp` and runs a Docker container with the appropriate image (node or python).
- The container runs the user code and returns stdout/stderr.
- Submissions are recorded to the `Submission` model.
- For real judging, you'd implement a test harness that invokes functions with inputs and compares outputs. This demo runs the code and returns raw output/error.

## Security notes
- Running arbitrary user code is dangerous. The demo uses Docker for isolation, but Docker containers can still be abused if not properly limited.
- For production:
  - Use ephemeral user namespaces, cgroups, time/memory limits, and image hardening.
  - Consider separate execution service with strict quotas, unprivileged containers, or sandboxing tools (Firejail, gVisor, Kata Containers).
  - Validate and sanitize inputs, avoid mounting sensitive host paths, and monitor resource usage.

## VS Code tips
- Use the built-in debugger for backend by adding a launch configuration to run `server.js` with `envFile` pointing to `/backend/.env`.
- Use the `Docker` extension to inspect containers when running code.
- Consider using multi-root workspace for backend & frontend.

## What's included
- `backend/` - Express server, models, routes, seed script, Docker runner (demo).
- `frontend/` - React app with Monaco editor.
- `.env.example` - Example environment variables.

If you'd like, I can now package this into a ZIP for download (ready-to-run), or push it to a GitHub repo and provide step-by-step video-style commands.
