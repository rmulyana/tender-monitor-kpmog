const notFound = (req, res, next) => {
  res.status(404).json({ error: "Not found" });
};

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = status === 500 ? "Internal server error" : err.message;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(status).json({ error: message });
};

module.exports = { notFound, errorHandler };
