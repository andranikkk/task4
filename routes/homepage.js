const express = require("express");
const { all, remove, block, unblock } = require("../controllers/homepage");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, all);

router.delete("/remove/:id", auth, remove);

router.patch("/block/:id", auth, block);

router.patch("/unblock/:id", auth, unblock);

module.exports = router;
