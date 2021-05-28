const express = require ("express");
const app = express();
const cors = require("cors");
const pool = require ("./db");
const { json } = require("express");


//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// ROUTES

// register & login
app.use("/auth", require("./routes/jwtAuth"));

// dashboard
app.use("/dashboard", require("./routes/dashboard"));


//create a todo
app.post("/todos", async(req, res)=>{
    try  {
        const data= req.body;   
     
        const newTodo = await pool.query('INSERT INTO todo (description, name, category, date) VALUES($1, $2, $3,CURRENT_TIMESTAMP) RETURNING *', [data.description, data.name, data.category]);
        res.json(newTodo.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

//get all todos

app.get("/todos",async(req, res)=>{
    try {
        const allTodos = await pool.query('SELECT * FROM todo');
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a todo

app.get("/todos/:id", async(req, res)=>{
    try  {

        const { id } = req.params;
        const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1' ,[
            id]);

            res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
    
//update a todo

    app.put("/todos/:id", async (req, res)=>{
        try {
            const { id } = req.params;
            const data = req.body;
            const updateTodo = await pool.query('UPDATE todo SET description = $1, name = $2, category = $3 WHERE todo_id = $4', [data.description, data.name, data.category, id]);
            res.json("To do was updated.");
        } catch (err) {
            console.error(err.message);
        }
    })

 //delete a todo

 app.delete("/todos/:id", async(req, res)=>{
    try  {

        const { id } = req.params;
        const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1' ,[
            id]);

            res.json("Todo was deleted!");
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(5000, () => {
    console.log("server has started on port 5000");
});
