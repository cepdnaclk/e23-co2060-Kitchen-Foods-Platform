// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err.stack);
  res.status(status).json({
    status,
    message: status === 500 ? "Something went wrong" : err.message,
    error: err.message,
  });
};
