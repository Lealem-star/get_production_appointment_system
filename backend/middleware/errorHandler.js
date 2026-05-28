function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Not Found' })
}

function errorHandler(error, _req, res, _next) {
  // eslint-disable-next-line no-console
  console.error(error)
  const status = Number(error.statusCode || error.status || 500)
  const message = error.message || 'Internal Server Error'
  res.status(status).json({ error: message })
}

module.exports = { notFoundHandler, errorHandler }
