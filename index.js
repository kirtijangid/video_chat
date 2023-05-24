const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const express = require("express");
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "caller"
})

app.post('/Sidebar', (req,res) => {
    const sql = "INSERT INTO CALLER_DETAILS(name,caller_id) VALUES (?)";
   const values = [ 
    req.body.name,
    req.body.idToCall
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


const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());
app.use(express.json);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
