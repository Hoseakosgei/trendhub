/**
 * Global error handler – must be registered LAST with app.use()
 */
function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production'

  // Log the error
  console.error(`[${new Date().toISOString()}] ERROR ${req.method} ${req.path}:`, err.message)
  if (isDev) console.error(err.stack)

  // Determine status code
  const statusCode = err.statusCode || err.status || 500

  res.status(statusCode).json({
    error:   err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
  })
}

/**
 * 404 handler – catches unmatched routes
 */
function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` })
}

/**
 * Helper: create an error with a status code
 */
function createError(message, statusCode = 400) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

module.exports = { errorHandler, notFound, createError }
