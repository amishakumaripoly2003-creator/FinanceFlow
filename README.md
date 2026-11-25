# 💰 FinanceFlow – Personal Finance Dashboard

FinanceFlow is a personal finance management web application that helps users manage their income, expenses, monthly budgets, financial goals, and recurring transactions in one place.

It provides an interactive dashboard to track financial activities and manage personal finances efficiently.

## ✨ Features

### 1. User Authentication
- User Registration
- Secure Login and Logout
- Password Hashing
- JWT-based Authentication
- Session Expiration Handling
- User-specific Data Management

### 2. Transaction Management
- Add Income and Expenses
- Edit and Delete Transactions
- Search and Filter Transactions
- View Transaction History

### 3. Monthly Budget System
- Create Monthly Budgets
- Update Budget Amounts
- Track Monthly Expenses
- Calculate Remaining Budget

### 4. Financial Goals
- Create Financial Goals
- Add Money to Goals
- Track Goal Progress
- Delete Goals

### 5. Recurring Transactions
- Create Recurring Transactions
- Enable or Disable Transactions
- Delete Recurring Transactions
- Automatic Recurring Transaction Processing

### 6. Dashboard & Analytics
- Total Balance
- Total Income
- Total Expenses
- Financial Overview
- Interactive Charts and Analytics

### 7. Additional Features
- CSV Import and Export
- Multiple Currency Selection
- Light and Dark Theme
- Responsive User Interface

## 🛠️ Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication & Security**
- JWT (JSON Web Token)
- bcryptjs
- dotenv



## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open Project Folder

```bash
cd Personal-Financial-Dashboard
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Add:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/financeDB
JWT_SECRET=your_secret_key
```

Use your own secure JWT secret.

### 5. Start MongoDB

Make sure MongoDB is installed and running.

### 6. Start Backend Server

```bash
node server.js
```

Backend runs at:

```text
http://localhost:5000
```

### 7. Run Frontend

Open `index.html` using VS Code Live Server.

## 🔐 Security

- Passwords are securely hashed.
- JWT authentication protects API routes.
- User-specific data access is maintained.
- Invalid and expired sessions are handled automatically.

## 🎯 Project Objective

The main objective of FinanceFlow is to make personal financial management simple and accessible.

It helps users track their spending, manage budgets, achieve financial goals, and understand their financial activities through a single dashboard.

## 👩‍💻 Project Information

**Project Name:** FinanceFlow

**Project Type:** Full Stack Web Development

**Domain:** Personal Finance Management

## 📌 Future Enhancements

- Advanced Financial Insights
- Improved Financial Reports
- Enhanced Mobile Experience

---

### FinanceFlow – Manage Your Money Smarter! 💰