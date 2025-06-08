require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const database = require("./config/database");
const route = require("./routes/client/index.route")

const app = express();

app.use(express.json());

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));


database.connect();
route(app);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});