const router = require("express").Router();
const pool = require ("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require ("../middleware/authorization");
// register

router.post("/register", validInfo, async (req, res) => {
    try {
        // 1. destructure the req.body (name, email, password)

        const { name, email, password } = req.body;

        // 2. check is user exist (if user exist then throw error)

        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

        if(user.rows.length !== 0){
            return res.status(401).send("User already exists.");
        }

        // 3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. enter the new user inside database

        const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [name, email, bcryptPassword]);

        // 5. generating jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);
        
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

// login post

router.post("/login", validInfo, async (req, res) => {
    try {
        // 1. destructure the req.body

        const {email, password} = req.body;

        // 2. check if user doesn't exist

        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);

        if (user.rows.length === 0){
            return res.status(401).send("Incorrect credentials.");
        }

        // 3. check if incoming pass is the same 

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if(!validPassword){
            return res.status(401).send("Incorrect credentials.");
        }

        // 4. give jwt token

        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
    }
});

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;
