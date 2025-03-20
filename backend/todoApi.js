import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const { Client } = pg;

// Database Connection Config
const client = new Client({
  database: process.env.DB_NAME || 'todoList',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD || 'postgres',
  user: process.env.DB_USER || 'postgres'
});

client.connect().then(() => console.log("Connected to PostgreSQL")).catch(err => console.error("Database connection error:", err));

router.get('/todos/:id', async (req, res) => {
    const id = req.params.id
    try {
      const result = await client.query(`SELECT * FROM todos where todos.user_id=${id} ORDER BY id ASC`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/users', async (req, res) => {
    try {
      const result = await client.query(`SELECT * FROM users`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/addTodos', async (req, res) => {
    const todoData = req.body
    try {
      const result = await client.query(`INSERT INTO todos (user_id, title, desciption, priority, tags, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,[todoData.userId, todoData.title, todoData.description, todoData.priority, todoData.tags, todoData.notes]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/editTodos/:id', async (req, res) => {
    const id = req.params.id
    const todoData = req.body
    try {
      await client.query(`UPDATE todos SET title=$1,desciption=$2,priority=$3,tags=$4,notes=$5,complete_status=$6 WHERE id=$7`,[todoData.title, todoData.description, todoData.priority, todoData.tags, todoData.notes,todoData.complete_status, id]);
      res.json("Successfully Updated Todo");
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/addNewTodoNote/:id', async (req, res) => {
  const id = req.params.id
  const { notes } = req.body;
  try {
    await client.query(`UPDATE todos SET notes=$1 WHERE id=$2`,[notes, id]);
    res.json("Successfully added note");
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/deleteTodo/:id', async (req, res) => {
    const id = req.params.id
    try {
      await client.query(`Delete FROM todos WHERE id=$1`,[id]);
      res.json("Successfully Deleted Todo");
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
