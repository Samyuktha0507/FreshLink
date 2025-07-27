const errorHandler = (err, req, res, next) => {
  // Use the status code from the error if it exists, otherwise default to 500 (Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Send back a JSON object with the error message
  res.json({
    message: err.message,
    // Also send the stack trace, but only if we are not in production mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
