require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/db");
const allRoutes = require("./Routes/productRoutes");

connectDB.connect();
app.use(express.json());
app.use(cors());
app.use("/", allRoutes);

app.listen(2000);
