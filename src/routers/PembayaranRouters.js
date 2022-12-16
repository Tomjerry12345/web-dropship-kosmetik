const express = require("express");
const router = express.Router();

const controllers = require("../controllers/PembayaranControllers.jsx");

router.post("/transaction", controllers.transaction);
router.post("/getStatus", controllers.getStatus);

module.exports = router;
