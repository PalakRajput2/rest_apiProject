const express = require("express");

const connectMongoDB = require("./connection"); // Corrected import


const {logReqRes} = require("./middlewares")
const userRouter = require("./routes/user")
const app = express();
const PORT = 8000;


//Connection with MongoDB
connectMongoDB("mongodb://localhost:27017/node-project-1").then(()=>{console.log("MongoDb connected")});
//Middleware
app.use(express.urlencoded({ extended: "false" }));

app.use(logReqRes("log.txt"));

//Routes
app.use("/api/users",userRouter);

app.listen(PORT, () => {
  console.log(`Server started at Port : ${PORT}`);
});
