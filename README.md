# Task Management System

A full-stack task management application built with React.js frontend, Spring Boot backend, PostgreSQL database, and secured with JWT authentication.

## 🚀 Features

- **User Authentication & Authorization**

  - User registration and login
  - JWT-based authentication

  - Secure password hashing

- **Task Management**

  - Create, read, update, and delete tasks
  - Task priority levels
  - Due date management
  - Task categorization

- **User Dashboard**
  - Personal task overview
  - Task filtering
  - Responsive design

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI library
- **JavaScript** - Programming language
- **CSS3** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend

- **Spring Boot** - Java framework
- **Spring Security** - Authentication & authorization
- **JWT (JSON Web Tokens)** - Token-based authentication
- **Spring Data JPA** - Data persistence
- **Maven** - Dependency management

### Database

- **PostgreSQL** - Primary database

### Security

- **JWT Authentication** - Stateless authentication
- **BCrypt** - Password hashing
- **CORS Configuration** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application locally, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Java** (JDK 11 or higher)
- **Maven** (v3.6 or higher)
- **PostgreSQL** (v12 or higher)

> **Note**: The application is already deployed and running on Render. These prerequisites are only needed for local development.

## ⚙️ Installation & Setup

### 🌐 Live Application

The application is deployed and ready to use on Render:

- **Access the live app**: https://task-management-3-u6a0.onrender.com/

### 🏠 Local Development Setup

If you want to run the application locally for development:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE task_management_db;
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Update `application.properties` or `application.yml`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/task_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000
```

Install dependencies and run:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install

```

Start the development server:

````bash
npm run dev


The frontend will start on `http://localhost:5173`

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task


## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
````

### Tasks Table

```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'TODO',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    due_date TIMESTAMP,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Encryption**: BCrypt hashing for secure password storage
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Request Validation**: Input validation and sanitization

## 🧪 Testing

### Backend Testing

```bash
cd backend1
mvn test
```

### Frontend Testing

```bash
cd frontend
npm test
# or
yarn test
```

## 📱 Usage

1. **Register** a new account or **login** with existing credentials
2. **Create tasks** with title, description, priority, and due date
3. **Update task status** as you progress 
4. **Filter and sort** tasks based on various criteria
5. **Delete** completed or unnecessary tasks

## 🚀 Deployment

This application is deployed on **Render** with the following setup:

### Live Application

- **Frontend**: https://task-management-3-u6a0.onrender.com
- **Backend**: https://task-management-1-cdb4.onrender.com

### Render Deployment Configuration

#### Backend (Spring Boot)

1. **Build Command**: `mvn clean package -DskipTests`
2. **Start Command**: `java -jar target/task-management-*.jar`
3. **Environment Variables**:
   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=86400000
   SPRING_PROFILES_ACTIVE=prod
   ```

#### Frontend (React)

1. **Build Command**: `npm install && npm run build`
2. **Publish Directory**: `build`
3. **Environment Variables**:

   ```

   ```

#### Database

- **PostgreSQL**: Deployed as a managed database service on Render
- Connection string automatically provided via `DATABASE_URL` environment variable

### Production Configuration

Update your `application-prod.properties`:

```properties
# Database Configuration (uses DATABASE_URL from Render)
spring.datasource.url=${DATABASE_URL}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

# CORS Configuration for production
cors.allowed-origins=https://your-frontend-url.onrender.com
```

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Render
2. **Configure Services**: Set up separate services for frontend, backend, and database
3. **Environment Variables**: Configure all required environment variables
4. **Auto-Deploy**: Enable automatic deployments on git push
5. **Custom Domain** (Optional): Configure custom domain if needed

---

**Happy Task Managing! 📋✅**
