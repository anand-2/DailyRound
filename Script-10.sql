CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    desciption TEXT,
    priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low')) NOT NULL,
    tags TEXT[],
    notes TEXT[],
    complete_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES
('Anand', 'anand@gmail.com'),
('Rvnd', 'rvnd.blr@live.com'),
('Chitra', 'chitra.balaji@gmail.com');

INSERT INTO todos (user_id, title, desciption, priority, tags, notes)
VALUES (1, 'Complete Assignment', 'Finish by tomorrow', 'High',ARRAY['Work'],ARRAY['Started']);
       
INSERT INTO todos (user_id, title, desciption, priority, tags, notes)
VALUES (1, 'Backend setup', 'elvndlvnlenvlenv', 'Medium', 
        ARRAY['Work','School'], 
        ARRAY['Svldnvldknvdtarted']);
       
INSERT INTO todos (user_id, title, priority, tags)
VALUES (1, 'Pass assignment', 'Medium', 
        ARRAY['Work','School','Learning']);
       
INSERT INTO todos (user_id, title, priority, tags, complete_status)
VALUES (1, 'scscscs vlnsvlksnvlsknv', 'Low', 
        ARRAY['Fun'], true);
       
Select * from  todos;
Select * from users; 
