const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "caller"
})

app.post('/Context', (req,res) => {
    const sql = "INSERT INTO CALLER_DETAILS(name,caller_id) VALUES (?)";
   const values = [ 
    req.body.name,
    req.body.me
   ]
    db.query(sql, [values], (err,data) => {
        if(err){
            return res.json("erroe");
        }
        return res.json(data);
    })
})

app.listen(8081, ()=>{
    console.log("listening");
   
})