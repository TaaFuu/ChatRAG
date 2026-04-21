const chatbotApi = require("./chatbot_router");
module.exports = (app) => {
    app.use("/api/chatbot", chatbotApi);
}