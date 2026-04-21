const express = require("express");
const router = express.Router();
const controller = require("../../controller/api/chatbot.api_controller");

router.post("/search", controller.searchPost);

module.exports = router