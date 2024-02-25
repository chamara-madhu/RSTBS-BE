const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mongoUrl = process.env.MONGO_CONNECTION_STRING;

// require("dotenv").config();

// app
const app = express();

// connect database
mongoose
  .connect(mongoUrl || "mongodb://localhost:27017/arti")
  .then(() => console.log("db is running"))
  .catch((err) => console.log(err));

// load routers
const authRoutes = require("./routes/api/authRoutes");
const applicationRoutes = require("./routes/api/applicationRoutes");

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use(cors());

// routes middleware
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/season-tickets", applicationRoutes);

// port
const PORT = process.env.PORT || 8000;

// run server
app.listen(PORT, () => console.log(`server is running in Port ${PORT}`));
