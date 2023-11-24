/* eslint-disable no-unused-vars */
const errorMiddleware = (err, _req, res, _next) => {
  const errorMessage = err.message.startsWith('Error: ')
    ? err.message.slice(7) // Remove the "Error: " prefix
    : err.message; // Keep the original message if "Error: " is not present
  res.json({
    isSuccess: false,
    message: errorMessage,
  });
};

module.exports = errorMiddleware;
/* eslint-enable no-unused-vars */
