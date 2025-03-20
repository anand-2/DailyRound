How to Run the Application
Prerequisites
Ensure you have the following installed on your machine:

Node.js: Download and install Node.js
PostgreSQL: Download and install PostgreSQL
Step 1: Clone the Repository
Clone the repository to your local machine:

bash
Copy code
git clone <your-repo-url>
cd <repo-name>
Step 2: Set Up PostgreSQL
Create the database:
Open your PostgreSQL terminal and create a new database:

bash
Copy code
CREATE DATABASE myapp;
Run the SQL Script:
Inside your project directory, locate the file Script-10.sql and run it to create the necessary tables and insert initial data into your database. You can do this using the PostgreSQL terminal:

bash
Copy code
psql -U postgres -d myapp -f Script-10.sql
Configure Database Connection:
Update the database connection settings in your backend code (usually in a .env file or config file). Set the connection string to match your PostgreSQL setup, e.g.,

Step 3: Install Dependencies
Backend (Node.js)
From the root directory, navigate to the backend folder and install dependencies:

bash
Copy code
cd backend
npm install
Frontend (React)
Navigate to the frontend folder and install dependencies:

bash
Copy code
cd frontend
npm install
Step 4: Run the Application
Starting the Backend Server
From the backend directory, run the following command to start the backend server:

bash
Copy code
npm start
The server will run on http://localhost:5000.

Starting the Frontend Server
From the frontend directory, run the following command to start the frontend server:

bash
Copy code
npm start
The frontend will run on http://localhost:3000.

Step 5: Access the Application
Once both the frontend and backend servers are running, you can access the app in your browser at http://localhost:3000.



Features that I have implimented from the assignment

