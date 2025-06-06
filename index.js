require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const database = require("./config/database");
const route = require("./routes/client/index.route")

const app = express();

app.use(express.json());
route(app);


database.connect();



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});