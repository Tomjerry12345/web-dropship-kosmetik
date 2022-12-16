const express = require("express");
const router = express.Router();

const controllers = require("../controllers/UsersControllers.jsx");

router.post("/add", controllers.addUser);
router.post("/getByEmail", controllers.getUsersByEmail);
router.put("/update/:email", controllers.update);

module.exports = router;
