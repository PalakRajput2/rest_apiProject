const express = require("express");
const fs = require("fs");

const mongoose = require("mongoose");
const { timeStamp } = require("console");
const app = express();
const PORT = 8000;

//connection with database
mongoose
.connect("mongodb://localhost:27017/node-project-1")
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log("MongoDB error",err));

//Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender :{
    type : String
  },
},
{ timestamps : true}
);

const User = mongoose.model("user",userSchema);


//Middleware
app.use(express.urlencoded({ extended: "false" }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip}:${req.method}`,
    (err, data) => {
      next();
    }
  );
});
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
    <ul>
      ${allDbUsers.map((user) => `<li>${user.firstName}- ${user.email} </li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// REST API  various http methods
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});

  return res.json({ allDbUsers });
});

app
  .route("/api/users/:id")
  .get( async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      return res.json({ user });
    } else {
      //status code 404 not found
      return res.status(404).json({ error: "User not found" });
    }
  })
  .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        return res.json({msg : "Success"})
  })
 .patch(async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      return res.json({ msg: "Success", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ msg: "Error updating user", error: error.message });
    }
  });

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res
      .status(400)
      .json({ msg: "All fields are required...Must fill it " });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName : body.last_name,
    email :body.email,
    gender : body.gender,
    jobTitle : body.job_title
  })
  console.log(result);
  return res.status(201).json({msg :"Success"})
});

app.listen(PORT, () => {
  console.log(`Server started at Port : ${PORT}`);
});
