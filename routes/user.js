const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleUpdateUserById,
  handleCreateNewUser,
} = require("../controller/user");
const router = express.Router();

// REST API  various http methods
router
    .route("/")
    .get(handleGetAllUsers)
    .post(handleCreateNewUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .delete(handleDeleteUserById)
  .patch(handleUpdateUserById);

module.exports = router;
