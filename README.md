# ResumeAI

ResumeAI is a full-stack resume builder that helps users create, preview, and manage resumes with AI-powered tools and analytics.

## ✨ Features

- AI-assisted resume creation and optimization
- Resume templates and live preview
- User authentication with OTP-based email login
- Resume analytics and download tracking
- Responsive dashboard for managing resumes

## 🧰 Tech Stack

### Frontend
- React 19
- Vite 8
- Tailwind CSS
- React Router
- React Icons

### Backend
- Node.js
- Express
- MongoDB
- JWT authentication
- Nodemailer for OTP emails
- Google Gemini AI integration

## 📁 Project Structure

- `frontend/` – React + Vite client
- `backend/` – Express API server
- `package.json` – root scripts for installing and running the full app

## 🚀 Local Development

### 1. Install dependencies

```bash
npm install
npm run install:frontend
npm run install:backend
```

### 2. Start the app

```bash
npm run dev
```

This starts:
- frontend on `http://localhost:5173`
- backend on `http://localhost:5000`

## 🔧 Environment Variables

Create the following files before running the project:

### `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="ResumeAI Verification <your_email@gmail.com>"
GEMINI_API_KEY=your_google_gemini_key
```

### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🏗️ Build for Production

```bash
npm run build
```

The production build is created in `frontend/dist`.

## 📦 Deploying on GitHub

### Frontend (GitHub Pages)

GitHub Pages is ideal for the React frontend.

1. Create a GitHub repository and push the code.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Add a workflow that builds `frontend/` and deploys `frontend/dist`.
5. After the workflow runs, your site will be available at:
   `https://<your-username>.github.io/<repo-name>/`

### Backend

The backend should be deployed separately (for example on **Render**, **Railway**, or **Vercel**). Update `VITE_API_BASE_URL` in the frontend environment to point to the deployed backend URL.

## 📝 Notes for Deployment

- The frontend uses the `VITE_API_BASE_URL` variable for API requests.
- If you change the backend host, update the frontend `.env` file and redeploy.
- The `frontend/dist` folder is a build artifact and should not be committed.

## ✅ Recommended GitHub Repo Setup

- Keep `node_modules/` out of version control
- Commit `frontend/src`, `backend/`, `package.json`, and README files
- Ignore build artifacts like `frontend/dist`
- Add `.env` files to `.gitignore`
