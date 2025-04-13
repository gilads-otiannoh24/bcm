# Business Card Manager - Business Card Manager

Business Card Manager is a modern business card management platform designed to help professionals create, share, and manage their digital business cards with ease. This full-stack application provides a comprehensive solution for digital business card management.

## 🌟 Features

### For Users

- **Digital Business Cards**: Create beautiful, customizable digital business cards
- **Card Sharing**: Share cards instantly via email, messaging apps, or QR codes
- **User Profiles**: Manage your professional profile and connections
- **Multiple Card Templates**: Choose from professional, creative, minimal, bold, and elegant templates
- **Card Analytics**: Track views and shares of your business cards

### For Administrators

- **User Management**: Comprehensive tools for managing users
- **Role-Based Access Control**: Define custom roles and permissions

## 🛠️ Technology Stack

### Frontend

- **Vite**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind CSS
- **Lucide React**: Icon library
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Nodemailer**: Email sending functionality
- **Winston**: Logging library

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/bcm.git
   cd bcm
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**

   Create a `apps/frontend/.env` file in the root directory for frontend environment variables:
   \`\`\`
   VITE_API_URL=http://localhost:5000/api/v1
   \`\`\`

   Create a `apps/backend/.env` file in the server directory for backend environment variables:
   \`\`\`
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_url_here
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   JWT_EXPIRE_HOURS=1
   JWT_COOKIE_EXPIRE=30
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@example.com
   SMTP_PASSWORD=your_password
   FROM_EMAIL=noreply@businesscardmanager.com
   FROM_NAME=Business Card Manager
   FRONTEND_URL=http://localhost:5173
   ADMIN_SETUP_TOKEN=your_secure_admin_setup_token_here
   ALLOWED_ORIGINS=http://localhost:5173
   ADMIN_EMAIL=admin@businesscardmanager.com
   \`\`\`

4. **Run the development servers**

   Start the frontend:
   \`\`\`bash
   cd apps/frontend
   npm run dev
   \`\`\`

   Start the backend (in a separate terminal):
   \`\`\`bash
   cd apps/frontend
   npm run dev
   \`\`\`

5. **Access the application**

   Frontend: http://localhost:5173

   Backend API: http://localhost:5000/api/v1

## 🔑 Initial Setup

### Creating the First Admin User

When you first run the application, you'll need to create an admin user:

1. Make a POST request to `/api/v1/users/create-admin` with the following body:
   \`\`\`json
   {
   "firstName": "Admin",
   "lastName": "User",
   "email": "admin@example.com",
   "password": "SecurePassword123!",
   "setupToken": "your_admin_setup_token_here"
   }
   \`\`\`

2. Use the admin credentials to log in to the application.

## 📁 Project Structure

\`\`\`
Business Card Manager/
├── apps/ # apps directory
│ ├── frontend/ # frontend files
│ ├── backend/ # backend files
│ └── ...
├── shared/ # Shared types and utilities
│ └── types/ # TypeScript type definitions
└── ...
\`\`\`

## 🔄 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Request password reset
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

### Users

- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get single user (admin)
- `POST /api/v1/users` - Create user (admin)
- `PUT /api/v1/users/:id` - Update user (admin)
- `DELETE /api/v1/users/:id` - Delete user (admin)

### Business Cards

- `GET /api/v1/businesscards` - Get all cards (admin)
- `GET /api/v1/businesscards/me` - Get user's cards
- `GET /api/v1/businesscards/:id` - Get single card
- `POST /api/v1/businesscards` - Create card
- `PUT /api/v1/businesscards/:id` - Update card
- `DELETE /api/v1/businesscards/:id` - Delete card
- `POST /api/v1/businesscards/:id/share` - Share card
- `GET /api/v1/businesscards/share/:shareableLink` - Get card by shareable link

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Building for Production

To build the application for production, run the following command:
\`\`\`bash # build frontend
cd apps/frontend
npm run build

      # build backend
      cd apps/backend
      npm run build

\`\`\`

This will create a `dist` folders in the project apps directories each, which contains the built frontend and backend

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For support or inquiries, please contact us at support@businesscardmanager.com.

---

Built with ❤️ by Websoft Team
