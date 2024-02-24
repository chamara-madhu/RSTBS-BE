const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const uri =
  "mongodb+srv://artiAdmin:Articare1@@arti.we407.mongodb.net/arti?retryWrites=true&w=majority";

// require("dotenv").config();

// app
const app = express();

// connect database
mongoose
  .connect(
    "mongodb+srv://rstrsg11:rstrsg11@projects.helxlxu.mongodb.net/rstrs?retryWrites=true&w=majority" ||
      "mongodb://localhost:27017/arti"
  )
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
