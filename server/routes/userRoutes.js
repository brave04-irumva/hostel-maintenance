const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser } = require("../controllers/userController");

// GET all users
router.get("/", getAllUsers);

// DELETE a user by ID
router.delete("/:id", deleteUser);

module.exports = router;