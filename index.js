const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({ extended: "false" }));

app.use((req,res,next)=>{
  fs.appendFile("log.txt",`\n${Date.now()}:${req.ip}:${req.method}`,(err,data)=>{
    next();
  })
})
app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// REST API  various http methods
app.get("/api/users", (req, res) => {
  return res.json({ users });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (user) {
      return res.json({ user });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const usersToDel = users.filter((user) => user.id !== id);
    fs.writeFile("MOCK_DATA.json", JSON.stringify(usersToDel), (err, data) => {
      return res.json({ status: "Success", id });
    });
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body };
      users[userIndex] = updatedUser;

      fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update user" });
        }
        return res.json({ status: "Success", user: updatedUser });
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });


  app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Failed to write to file" });
        } else {
            return res.json({ message: "Pass!" });
        }
    });
});

app.listen(PORT, () => {
  console.log(`Server started at Port : ${PORT}`);
});
