# SRM Timetable Management System - Backend

A comprehensive backend system for managing academic timetables, staff, and departments with real-time features.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Updates**: Socket.IO integration for live updates
- **AI Timetable Generation**: Intelligent scheduling with constraint satisfaction
- **RESTful API**: Complete CRUD operations for all entities
- **Database Management**: PostgreSQL with Sequelize ORM
- **Email Notifications**: Automated email system for user management
- **File Upload**: Support for document management
- **Comprehensive Logging**: Winston-based logging system
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Email**: Nodemailer
- **Logging**: Winston
- **Validation**: Express-validator

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb srm_timetable
   
   # Run migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/approve` - Approve user
- `POST /api/users/:id/reject` - Reject user

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Timetables
- `GET /api/timetables` - Get all timetables
- `GET /api/timetables/:id` - Get timetable by ID
- `POST /api/timetables` - Create timetable
- `POST /api/timetables/:id/generate` - Generate AI timetable
- `PUT /api/timetables/:id/slots/:slotId` - Update timetable slot
- `POST /api/timetables/:id/publish` - Publish timetable

### Choice Forms
- `GET /api/choice-forms` - Get all forms
- `GET /api/choice-forms/active` - Get active forms
- `POST /api/choice-forms` - Create form
- `POST /api/choice-forms/:id/submit` - Submit form response

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## Database Schema

### Core Tables
- **User**: Staff and admin information
- **Department**: Academic departments
- **Subject**: Course subjects
- **Timetable**: Timetable containers
- **TimetableSlot**: Individual time slots
- **Room**: Classroom and lab information
- **ChoiceForm**: Dynamic forms for preferences
- **FormSubmission**: Form responses
- **Notification**: User notifications
- **Constraint**: Scheduling constraints

## Real-time Features

The system uses Socket.IO for real-time updates:

- **Timetable Updates**: Live timetable changes
- **Form Submissions**: Real-time form submission notifications
- **Staff Approvals**: Instant approval/rejection updates
- **System Announcements**: Broadcast messages
- **Typing Indicators**: Form editing indicators

## AI Timetable Generation

The system includes an intelligent timetable generator that:

- Considers multiple constraints (workload, preferences, room availability)
- Optimizes for minimal conflicts
- Balances instructor workload
- Respects time preferences
- Handles lab requirements and dual instructors

## Security Features

- JWT-based authentication
- Role-based authorization
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Password hashing with bcrypt

## Deployment

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=srm_timetable
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run db:migrate`
4. Start server: `npm start`

## Development

### Database Commands
```bash
# Reset database
npm run db:reset

# Create migration
npx sequelize-cli migration:generate --name migration-name

# Create seeder
npx sequelize-cli seed:generate --name seeder-name
```

### Testing
```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.