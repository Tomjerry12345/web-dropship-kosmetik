const express = require("express");
const router = express.Router();

const controllers = require("../controllers/ProdukControllers.jsx");

router.post("/add", controllers.add);
router.get("/getAll", controllers.get);
router.get("/get/:email", controllers.getByEmail);
router.get("/get/query/:query", controllers.getBySearching);
router.put("/update/:id", controllers.update);
router.put("/update/oneUpdate/:id", controllers.updateOneData);
router.delete("/delete/:id", controllers.delete);

module.exports = router;
