const express = require("express");
const router = express.Router();

const controllers = require("../controllers/RincianPesananControllers.jsx");

router.post("/add", controllers.add);
router.post("/get/:email", controllers.getByEmail);
router.put("/update/:id", controllers.update);
router.delete("/delete/:id", controllers.delete);

module.exports = router;
