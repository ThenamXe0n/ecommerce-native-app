require("dotenv").config()
const express = require("express");
const cors = require("cors");
const AuthRouters = require("./routes/auth.routes");
const errorMiddleware = require("./middleware/error.middleware");


const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce API Running"
  });
});

app.use("/auth",AuthRouters)


app.use(errorMiddleware);

module.exports = app;