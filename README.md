# BilkentForum

BilkentForum is a forum application for Bilkent University students that aim students to share their notes, course materials, and discuss about courses. It leverages a robust architecture using Go for the backend and React for the frontend, containerized with Docker for seamless deployment.

"It used to be broadcasted from the domain bilkentforum.com, but it is not anymore."

## 🚀 Technologies Used

This project is built with a focus on performance, scalability, and modern best practices.

### Backend
- **Go (Golang)**: High-performance backend service.
- **PostgreSQL**: Reliable relational database system (v15).
- **Docker & Docker Compose**: Containerization and orchestration for consistent development and deployment environments.
- **Goose**: Database migration tool for managing schema changes.
- **JWT (JSON Web Tokens)**: Secure authentication stateless mechanism.
- **AWS SDK for Go v2**: Integration with Amazon Web Services.

### Frontend
- **React 19**: The latest version of the library for building user interfaces.
- **Vite**: Next-generation frontend tooling for blazing fast build times.
- **React Router v7**: Declarative routing for React applications.

### Infrastructure & Cloud Services
- **Amazon S3**: Used for secure and scalable object storage (e.g., user uploads, media).
- **Amazon Route53**: Highly available and scalable cloud Domain Name System (DNS) web service for domain management.
- **Email Sending System**: Integrated email service (using **Resend**) for notifications, account verification, and other transactional emails.

---

## 📸 Screenshots

<!-- Please replace the following placeholder links with actual screenshots of your application -->

### Login Screen
![Login Screen](screenshots/Login_Screen.png)
*Secure login interface for users.*

### Home Page
![Home Page](screenshots/Home_Page.png)
*The main landing page showing the latest discussions.*

### Course Page
![Course Page](screenshots/Course_page.png)
*List of available courses and topics.*

### Discussion Thread
![Thread View](screenshots/Thread_Page.png)
*Detailed view of a discussion thread with comments.*

### About / Profile
![About Page](screenshots/About_Page.png)
*User profile and about information.*

---

## ✨ Features

- **User Authentication**: Secure signup and login flow using JWT only for Bilkent students.
- **Comment System**: Threaded discussions for each post.
- **Media Uploads**: Seamless image and file uploads to Amazon S3.
- **Real-time Updates**: Instant feedback and interaction updates.

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Docker** and **Docker Compose**
- **Go** (v1.23+)
- **Node.js** (for local frontend development outside Docker)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ismetinan/BilkentForum.git
   cd BilkentForum
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory. You can use the example below as a reference:
   ```env
   # Database
   POSTGRES_USER=ismetinan
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=forum_1
   DB_URL=postgres://ismetinan:your_password@postgres:5432/forum_1?sslmode=disable
   
   # AWS
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   S3_BUCKET_NAME=your_bucket_name
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   
   # App/JWT
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   ```

3. **Run with Docker Compose**
   Build and start the services:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Start the **Postgres** database.
   - Run database **migrations** (using Goose).
   - Start the **Backend** service on port `8080`.
   - Start the **Frontend** service on port `80`.

4. **Access the Application**
   - Frontend: `http://localhost` (or `http://localhost:5173` if running locally with Vite default)
   - Backend API: `http://localhost:8080`

### Database Migrations

Migrations are handled automatically by the `migrate` service in Docker Compose. To run them manually:
```bash
# Install Goose
go install github.com/pressly/goose/v3/cmd/goose@latest

# Run migrations
goose -dir ./sql/schema postgres "postgres://ismetinan:your_password@localhost:5432/forum_1?sslmode=disable" up
```

---

## 📂 Project Structure

```bash
BilkentForum/
├── cmd/                # Application entry points and Dockerfiles
├── frontend/           # React frontend application
├── internal/           # Private application and library code
├── sql/                # SQL queries and schema migrations
├── docker-compose.yml  # Docker services configuration
├── go.mod              # Go module definition
└── README.md           # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.