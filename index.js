const app = require('./app')
const http = require('http')
const logger = require('./utils/logger')
const config = require('./utils/config')

const PORT = 3003
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
