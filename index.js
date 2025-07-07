require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const database = require("./config/database");
const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")
const systemConfig = require("./config/system");
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
database.connect();

app.use("/upload", express.static(path.join(__dirname, "public/upload")));

route(app);

routeAdmin(app);

app.use((req, res, next) => {
    res.status(404).json({
        message: `Không tìm thấy '${req.originalUrl}'. Hãy kiểm tra phương thức và đường dẫn`,
    });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});