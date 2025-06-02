# 🌟 CustomerConnect CRM

<div align="center">
   <img alt="CustomerConnect CRM Banner" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" width="80%">
   <br/>
   <img alt="Made with React" src="https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react">
   <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-4.9.5-blue?style=flat-square&logo=typescript">
   <img alt="Node.js Version" src="https://img.shields.io/badge/Node.js-≥16.0.0-339933?style=flat-square&logo=node.js">
   <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white">
   <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square">
</div>

A modern, AI-powered CRM platform for next-generation customer relationship management.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Technical Decisions](#technical-decisions)
- [Developer](#developer)
- [License](#license)

---

## 🎯 Overview

CustomerConnect is an enterprise-grade CRM platform that empowers businesses to:

- 📊 Manage 5,000+ customer relationships efficiently
- 🎯 Create targeted customer segments with advanced filtering
- 📧 Run multi-channel marketing campaigns with 99.8% delivery rate
- 🤖 Get AI-powered insights processing 100K+ customer interactions
- 📈 Track campaign performance with 15+ KPIs

---

## ✨ Features

<details>
   <summary><b>🔐 Authentication & Authorization</b></summary>
   <ul>
      <li>Google OAuth 2.0 integration with secure callback handling</li>
      <li>JWT-based authentication with robust token management</li>
      <li>Role-based access control (admin/user)</li>
      <li>Comprehensive user profile management</li>
      <li>Secure password handling with bcrypt</li>
   </ul>
</details>

<details>
   <summary><b>👥 Customer Management</b></summary>
   <ul>
      <li>Detailed customer profiles with 30+ attributes</li>
      <li>Complete order history tracking</li>
      <li>Customer activity monitoring</li>
      <li>Comprehensive search and filtering</li>
      <li>Data visualization for customer insights</li>
      <li>Bulk import/export capabilities</li>
   </ul>
</details>

<details>
   <summary><b>🎯 Segmentation Engine</b></summary>
   <ul>
      <li>Intuitive rule-based segment builder</li>
      <li>Real-time audience estimation and preview</li>
      <li>Segment performance analytics</li>
   </ul>
</details>

<details>
   <summary><b>📢 Campaign Management</b></summary>
   <ul>
      <li>Multi-channel support: Email, SMS (Twilio), Push notifications</li>
      <li>Dynamic content personalization with 18+ variable types</li>
      <li>Campaign scheduling with timezone intelligence</li>
      <li>Performance analytics dashboard</li>
      <li>Comprehensive delivery tracking</li>
   </ul>
</details>

<details>
   <summary><b>🤖 AI-Powered Features</b></summary>
   <ul>
      <li>Google Gemini AI integration</li>
      <li>Campaign performance analysis with actionable insights</li>
      <li>Message optimization recommendations improving open rates by 32%</li>
      <li>Customer behavior pattern detection</li>
      <li>Smart scheduling recommendations</li>
      <li>AI chat assistant with business intelligence capabilities</li>
   </ul>
</details>

---

## 🛠️ Tech Stack

### Frontend

- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Query
- React Context API
- React Router DOM
- Recharts (data visualization)
- Axios (API requests)
- Lucide React (icons)

### Backend (see [CMS-Backend](https://github.com/piyush-kumar-agarwal1/CMS-Backend))

- Node.js, Express.js
- MongoDB + Mongoose
- JWT, Google OAuth
- Twilio (SMS), Nodemailer (Email)
- Google Gemini API (AI)

### DevOps

- Vercel (Frontend)
- GitHub Actions (CI/CD)
- Docker (optional for backend)

---

## 📂 Project Structure

```bash
frontend/
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities and API config
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   └── ...
├── public/              # Static assets
├── package.json
└── ...
```

---

## 🚀 Installation

1. **Clone the repositories**

   ```powershell
   git clone https://github.com/piyush-kumar-agarwal1/CMS-Frontend.git
   git clone https://github.com/piyush-kumar-agarwal1/CMS-Backend.git
   ```

2. **Install frontend dependencies**

   ```powershell
   cd CMS-Frontend
   npm install
   ```

3. **Install backend dependencies**

   ```powershell
   cd ../CMS-Backend
   npm install
   ```

4. **Configure environment variables**

   - Create `.env` file in both `frontend` and `backend` directories (see `.env.example` for reference)

5. **Start development servers**

   ```powershell
   # In one terminal
   npm run dev:server
   # In another terminal
   npm run dev:frontend
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Live Demo: [https://cms-frontend-mauve.vercel.app/](https://cms-frontend-mauve.vercel.app/)

---

## 📡 API Reference

### Authentication

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/api/auth/login`           | User login with email/password |
| POST   | `/api/auth/register`        | User registration              |
| POST   | `/api/auth/google`          | Google OAuth login             |
| POST   | `/api/auth/google/callback` | Google OAuth callback          |
| GET    | `/api/users/profile`        | Get user profile               |
| PUT    | `/api/users/profile`        | Update user profile            |

### Customers

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | `/api/customers`     | List all customers   |
| POST   | `/api/customers`     | Create new customer  |
| GET    | `/api/customers/:id` | Get customer details |
| PUT    | `/api/customers/:id` | Update customer      |
| DELETE | `/api/customers/:id` | Delete customer      |

### Segments

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/segments`         | List all segments   |
| POST   | `/api/segments`         | Create new segment  |
| GET    | `/api/segments/:id`     | Get segment details |
| PUT    | `/api/segments/:id`     | Update segment      |
| DELETE | `/api/segments/:id`     | Delete segment      |
| POST   | `/api/segments/preview` | Preview audience    |

### Campaigns

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/campaigns`          | List all campaigns   |
| POST   | `/api/campaigns`          | Create new campaign  |
| GET    | `/api/campaigns/:id`      | Get campaign details |
| PUT    | `/api/campaigns/:id`      | Update campaign      |
| DELETE | `/api/campaigns/:id`      | Delete campaign      |
| POST   | `/api/campaigns/:id/send` | Send campaign        |

### AI Features

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/api/ai/insights`            | Get AI insights        |
| POST   | `/api/ai/create-segment`      | AI segment creation    |
| POST   | `/api/ai/message-suggestions` | Generate message ideas |
| POST   | `/api/ai/chat`                | AI assistant chatbot   |

### Analytics

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/analytics`           | Get overview analytics |
| GET    | `/api/analytics/dashboard` | Get dashboard stats    |

---

## 🤔 Technical Decisions

### Frontend Architecture

- **React with TypeScript**: For type safety and scalable codebase
- **Vite**: For fast development and optimized builds
- **TailwindCSS + shadcn/ui**: For a modern, consistent design system
- **React Query**: For efficient server state management and caching
- **Context API**: For global state like authentication

### Performance Optimizations

- Code splitting and lazy loading for faster initial load
- Optimized API requests and caching
- Responsive UI for all device sizes

---

## 👨‍💻 Developer

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/104412532?v=4" width="100" style="border-radius: 50%"/>
  <br/>
  <b>Piyush Kumar Agarwal</b>
  <br/>
  <a href="https://github.com/piyush-kumar-agarwal1">GitHub</a> • <a href="https://www.linkedin.com/in/piyush-kumar-agarwal/">LinkedIn</a>
</div>

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/piyush-kumar-agarwal1">Piyush Kumar Agarwal</a>
</div>
