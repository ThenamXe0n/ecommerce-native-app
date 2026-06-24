require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AuthRouters = require("./routes/auth.routes");
const ProductRouters = require("./routes/product.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce API Running",
  });
});

app.use("/auth", AuthRouters);
app.use("/product",ProductRouters)

app.use(errorMiddleware);

module.exports = app;
