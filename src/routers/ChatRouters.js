const express = require("express");
const router = express.Router();

const controllers = require("../controllers/ChatControllers");

router.post("/add/", controllers.add);
router.get("/get/:email/:name", controllers.getListChat);
router.get("/get/detail-chat/:emailRoot/:emailChild", controllers.getChat);
// router.put("/update/:id", controllers.update);
// router.delete("/delete/:id", controllers.delete);

module.exports = router;
