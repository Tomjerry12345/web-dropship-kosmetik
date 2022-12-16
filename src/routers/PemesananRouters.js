const express = require("express");
const router = express.Router();

const controllers = require("../controllers/PemesananControllers.jsx");

router.post("/add", controllers.add);
router.get("/getAll", controllers.get);
router.get("/get/:email", controllers.getByEmail);
router.put("/update/:id", controllers.update);
router.delete("/delete/:id", controllers.delete);

module.exports = router;
