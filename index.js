const express = require('express');
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.get("/users", (req, res) => {
    const html = `
    <ul>
      ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
  `;
    res.send(html);
});

// REST API
app.get("/api/users", (req, res) => {
    return res.json({ users });
});

app.route("/api/users/:id")
        .get ((req, res) => {
            const id = Number(req.params.id);
            const user = users.find((user) => user.id === id);
            if (user) {
                return res.json({ user });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        })
        .delete( (req, res) => {
            //TODO : delete the user with id 
            return res.json({ status :"pending" });
        })
        .patch( (req, res) => {
            //TODO : edit the user with id 
            return res.json({ status :"pending" });
        });

app.post("/api/users", (req, res) => {
    //  todo : create a new user the status  is pending 
    return res.json({ status :"pending"});
});



app.listen(PORT, () => {
    console.log(`Server started at Port : ${PORT}`);
});
