const express = require("express");
const app = express();
const cors = require("cors");

// ---------------------- CORS FIX ----------------------
app.use(cors());
app.options(/.*/, cors());
// ------------------------------------------------------

//nhung Json
app.use(express.json());

// nhung env
require("dotenv").config();
const port = process.env.PORT;

//nhung file config
const database = require("./config/database");
database.connect();
database.connectPostgresql();

//nhung router
const apiRouter = require("./routes/api/index_api");
apiRouter(app);

app.listen(port, () => {
    console.log(`Đang chạy bởi đường dẫn ${port}`);
});