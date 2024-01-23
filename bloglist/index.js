const app = require('./app')
const cfg = require('./utils/config')
const log = require('./utils/logger')

app.listen(cfg.PORT, () => {
  log.info(`Server running on port ${cfg.PORT}`)
})
