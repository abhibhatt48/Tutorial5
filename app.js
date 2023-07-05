const express = require("express");
const fs = require("fs");
const app = express();
const uuid = require("uuid");

let usersList = [];

// Read data from user.json file if it exists
if (fs.existsSync('./users.json')) {
  const data = fs.readFileSync('./users.json', 'utf-8');
  usersList = JSON.parse(data);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", (req, res) => {
  res.status(200).json({ message: "Users retrieved", success: true, users: usersList });
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const filteredUser = usersList.filter((data) => data.id === id)[0];

  if (!filteredUser) {
    return res
      .status(400)
      .json({ message: "User doesn't exist for corresponding id.", success: false });
  }
  return res.status(200).json({ user: filteredUser, success: true });
});

app.post("/add", (req, res) => {
  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res
      .status(400)
      .json({ message: "Email and firstName are required", success: false });
  }

  const newUser = { id: uuid.v4(), email, firstName };
  usersList.push(newUser);

  // Write the new user data to the file
  fs.writeFileSync('./users.json', JSON.stringify(usersList, null, 2));

  return res.status(200).json({ message: "User added", success: true });
});

app.put("/update/:id", (req, res) => {
  const { email, firstName } = req.body;
  const { id } = req.params;
  if (!email || !firstName) {
    return res
      .status(400)
      .json({ message: "Email and firstName are required", success: false });
  }

  let userUpdated = false;

  usersList.forEach((userData) => {
    if (userData.id === id) {
      if (email) {
        userData.email = email;
      }
      if (firstName) {
        userData.firstName = firstName;
      }
      userUpdated = true;
    }
  });

  if (userUpdated) {
    // Write the updated user data to the file
    fs.writeFileSync('./users.json', JSON.stringify(usersList, null, 2));

    return res.status(200).json({ message: "User updated", success: true });
  }
  return res
    .status(400)
    .json({ message: "User not found for corresponding id.", success: false });
});

app.listen(8080, () => console.log('Server running on port 8080'));
