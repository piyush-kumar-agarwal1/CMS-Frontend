# CustomerConnect CRM Platform

A modern, AI-powered Customer Relationship Management platform built with React, TypeScript, and Node.js.

## Features

- **Customer Management**: Comprehensive customer database with detailed profiles
- **Smart Segmentation**: AI-powered customer segmentation with dynamic rule builder
- **Campaign Management**: Create, manage, and track marketing campaigns
- **Analytics Dashboard**: Real-time insights and performance metrics
- **AI Assistant**: Intelligent assistant for CRM tasks and recommendations
- **Authentication**: Secure login with Google OAuth integration
- **Responsive Design**: Mobile-first design with modern UI components

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Router for navigation
- Axios for API calls
- React Query for data management

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS configuration
- Google AI (Gemini) integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (optional)
- Google AI API key (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CMS-main
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   Create `.env` file in the `server` directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/customerconnect
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

5. **Start the development servers**

   Backend server:

   ```bash
   cd server
   npm run dev
   ```

   Frontend server (in a new terminal):

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
CMS-main/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # Utilities and API config
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── package.json
└── server/                # Node.js backend
    ├── controllers/       # Route controllers
    ├── middleware/        # Express middleware
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── config/           # Database configuration
    └── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Segments

- `GET /api/segments` - Get all segments
- `POST /api/segments` - Create new segment
- `PUT /api/segments/:id` - Update segment
- `DELETE /api/segments/:id` - Delete segment

### Campaigns

- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### AI Assistant

- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/generate-segment` - Generate customer segment
- `POST /api/ai/generate-campaign` - Generate campaign ideas

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
