const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/bankDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const bankRoutes = require("./routes/bankRoutes");
app.use("/api", bankRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

