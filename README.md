# Application Setup Guide

## Prerequisites
Ensure you have the following installed on your machine:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **PostgreSQL**: [Download and install PostgreSQL](https://www.postgresql.org/download/)

## Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
git clone <your-repo-url>
cd <repo-name>
```

## Step 2: Set Up PostgreSQL
Create the Database:
Open your PostgreSQL terminal and create a new database:


Copy code

```bash
CREATE DATABASE myapp;
```

Run the SQL Script:
Inside your project directory, locate the file Script-10.sql and run it to create the necessary tables and insert initial data into your database. You can do this using the PostgreSQL terminal:

```bash
Copy code
psql -U postgres -d myapp -f Script-10.sql
```
Configure Database Connection:
Update the database connection settings in your backend code (usually in a .env file or config file). Set the connection string to match your PostgreSQL setup.

## Step 3: Install Dependencies
Backend (Node.js)
From the root directory, navigate to the backend folder and install dependencies:
```bash
Copy code
cd backend
npm install
```
Frontend (React)
Navigate to the frontend folder and install dependencies:

```bash
Copy code
cd frontend
npm install
```
## Step 4: Run the Application
Starting the Backend Server
From the backend directory, run the following command to start the backend server:

```bash
Copy code
npm start
```
The server will run on http://localhost:5000.

Starting the Frontend Server
From the frontend directory, run the following command to start the frontend server:

```bash
Copy code
npm start
```
The frontend will run on http://localhost:3000.

## Step 5: Access the Application
Once both the frontend and backend servers are running, you can access the app in your browser at http://localhost:3000.

![image](https://github.com/user-attachments/assets/287248d0-e355-4ad5-a653-815bafeb3fa6)
![image](https://github.com/user-attachments/assets/5154458f-05bc-4eca-b609-3175f2f14f42)
![image](https://github.com/user-attachments/assets/a82a6951-ab6a-4172-8708-dbf3efacc18d)


## Implimented Requirements from the assignment

## 1. Todo Management

Create new todos with titles and descriptions (IMPLIMENTED)
Add tags and priorities to todos (High, Medium, Low) (IMPLIMENTED)
Tag/mention other users in todos (@username) (NOT IMPLIMENTED)
Edit existing todos (IMPLIMENTED)
Delete todos (IMPLIMENTED)


## 2. Todo Details
Click on a todo to view its details (tags, priority, notes, users) (IMPLIMENTED)
Add notes to a todo via a modal when clicking an icon next to the todo (IMPLIMENTED)


## 3. List View Features
List all todos with basic information (IMPLIMENTED)
Implementation of pagination (either infinite scroll or numbered pagination) (IMPLIMENTED)
Filter todos by tags, priority, or users (IMPLIMENTED)
Sort todos by creation date, priority, etc. (IMPLIMENTED)


## 4. Data Export [Optional]
Export all todos of a user (JSON or CSV format) (IMPLIMENTED)


## 5. User Management [Optional]
Backend: Pre-create at least 5 different users so that when tagging, the system can validate if the user exists. 
Frontend: Provide a dedicated tab that displays all users, allowing you to switch between users. When switching to a different user, the application (IMPLIMENTED)
should display all todos associated with that user.



