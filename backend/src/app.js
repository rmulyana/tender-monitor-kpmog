const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const tenderRoutes = require("./routes/tenders");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tenders", tenderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
